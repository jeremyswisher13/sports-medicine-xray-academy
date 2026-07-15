import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const projectId = 'demo-sxra';
let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

function signedIn(uid: string, email: string) {
  return testEnv.authenticatedContext(uid, { email }).firestore();
}

async function seed(path: string, data: Record<string, unknown>) {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), path), data);
  });
}

describe('Firestore learner isolation', () => {
  it('derives profile role from authenticated email and blocks role escalation', async () => {
    const db = signedIn('fellow-1', 'fellow-1@mednet.ucla.edu');
    const ref = doc(db, 'users/fellow-1');

    await assertSucceeds(
      setDoc(ref, {
        uid: 'fellow-1',
        email: 'fellow-1@mednet.ucla.edu',
        displayName: 'Fellow',
        role: 'fellow',
        createdAt: 1,
        lastLogin: 1,
      }),
    );
    await assertFails(updateDoc(ref, { role: 'admin' }));
    await assertSucceeds(updateDoc(ref, { displayName: 'Updated Fellow', lastLogin: 2 }));

    const attacker = signedIn('attacker', 'attacker@example.com');
    await assertFails(
      setDoc(doc(attacker, 'users/attacker'), {
        uid: 'attacker',
        email: 'attacker@example.com',
        displayName: 'Attacker',
        role: 'admin',
        createdAt: 1,
        lastLogin: 1,
      }),
    );
  });

  it('prevents a learner from overwriting another learner progress document', async () => {
    await seed('moduleProgress/owner_module', {
      userId: 'owner',
      moduleId: 'module',
      completed: false,
    });

    const attacker = signedIn('attacker', 'attacker@example.com');
    await assertFails(
      setDoc(doc(attacker, 'moduleProgress/owner_module'), {
        userId: 'attacker',
        moduleId: 'module',
        completed: true,
      }),
    );

    const owner = signedIn('owner', 'owner@example.com');
    await assertSucceeds(
      setDoc(
        doc(owner, 'moduleProgress/owner_module'),
        { userId: 'owner', moduleId: 'module', completed: true },
        { merge: true },
      ),
    );
  });

  it('allows only the bookmark owner to delete it', async () => {
    await seed('bookmarks/bookmark-1', {
      id: 'bookmark-1',
      userId: 'owner',
      moduleId: 'module',
      createdAt: 1,
    });

    const attacker = signedIn('attacker', 'attacker@example.com');
    await assertFails(deleteDoc(doc(attacker, 'bookmarks/bookmark-1')));

    const owner = signedIn('owner', 'owner@example.com');
    await assertSucceeds(deleteDoc(doc(owner, 'bookmarks/bookmark-1')));
  });

  it('keeps learner records private while allowing configured admin reads', async () => {
    await seed('quizAttempts/attempt-1', {
      id: 'attempt-1',
      userId: 'owner',
      scope: 'pre',
      startedAt: 1,
      answers: [],
      scorePercent: 50,
    });

    const attacker = signedIn('attacker', 'attacker@example.com');
    await assertFails(getDoc(doc(attacker, 'quizAttempts/attempt-1')));

    const admin = signedIn('admin', 'jswisher@mednet.ucla.edu');
    await assertSucceeds(getDoc(doc(admin, 'quizAttempts/attempt-1')));
  });
});
