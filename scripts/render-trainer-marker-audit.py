#!/usr/bin/env python3
"""Render trainer tour/check markers over their source radiographs for review."""

from __future__ import annotations

import argparse
import json
import math
import re
import textwrap
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    return parser.parse_args()


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    names = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for name in names:
        try:
            return ImageFont.truetype(name, size=size)
        except OSError:
            continue
    return ImageFont.load_default()


TITLE_FONT = font(28, bold=True)
BODY_FONT = font(19)
SMALL_FONT = font(16)
MARKER_FONT = font(16, bold=True)


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")


def fit_image(image: Image.Image, max_width: int = 900, max_height: int = 1050) -> Image.Image:
    ratio = min(max_width / image.width, max_height / image.height, 1)
    if ratio >= 1:
        return image.convert("RGB")
    return image.resize(
        (round(image.width * ratio), round(image.height * ratio)),
        Image.Resampling.LANCZOS,
    ).convert("RGB")


def draw_marker(
    draw: ImageDraw.ImageDraw,
    x: float,
    y: float,
    code: str,
    color: tuple[int, int, int],
) -> None:
    radius = 14
    draw.ellipse(
        (x - radius, y - radius, x + radius, y + radius),
        outline=color,
        width=5,
    )
    draw.line((x - 20, y, x + 20, y), fill=color, width=2)
    draw.line((x, y - 20, x, y + 20), fill=color, width=2)
    box = draw.textbbox((0, 0), code, font=MARKER_FONT)
    label_width = box[2] - box[0] + 10
    label_height = box[3] - box[1] + 8
    label_x = min(max(2, x + 16), draw._image.width - label_width - 2)
    label_y = min(max(2, y - label_height - 8), draw._image.height - label_height - 2)
    draw.rounded_rectangle(
        (label_x, label_y, label_x + label_width, label_y + label_height),
        radius=4,
        fill=(0, 0, 0),
        outline=color,
        width=2,
    )
    draw.text((label_x + 5, label_y + 3), code, fill=(255, 255, 255), font=MARKER_FONT)


def wrap_lines(value: str, width: int = 58) -> list[str]:
    return textwrap.wrap(value, width=width, break_long_words=False) or [""]


def render_group(
    root: Path,
    module_id: str,
    image_key: str,
    image_entry: dict,
    tour_items: list[dict],
    check_items: list[dict],
    output_path: Path,
) -> None:
    source = root / "public" / image_entry["src"].lstrip("/")
    radiograph = fit_image(Image.open(source))
    image_width, image_height = radiograph.size
    legend_width = 680
    title_height = 76
    legend_rows = sum(
        len(wrap_lines(item["text"])) + 1
        for item in tour_items + check_items
    )
    canvas_height = max(image_height + title_height, title_height + 34 + legend_rows * 24)
    canvas = Image.new("RGB", (image_width + legend_width, canvas_height), "white")
    canvas.paste(radiograph, (0, title_height))
    draw = ImageDraw.Draw(canvas)
    draw.rectangle((0, 0, canvas.width, title_height), fill=(9, 62, 92))
    draw.text(
        (20, 16),
        f"{module_id} | {image_key}",
        fill="white",
        font=TITLE_FONT,
    )

    for item in tour_items:
        marker = item["marker"]
        draw_marker(
            draw,
            marker["x"] / 100 * image_width,
            title_height + marker["y"] / 100 * image_height,
            item["code"],
            (0, 190, 220),
        )
    for item in check_items:
        marker = item["marker"]
        draw_marker(
            draw,
            marker["x"] / 100 * image_width,
            title_height + marker["y"] / 100 * image_height,
            item["code"],
            (225, 44, 126),
        )

    legend_x = image_width + 24
    y = title_height + 18
    draw.text((legend_x, y), "Tour markers", fill=(0, 125, 150), font=TITLE_FONT)
    y += 38
    for item in tour_items:
        for line_index, line in enumerate(wrap_lines(item["text"])):
            prefix = f'{item["code"]} ({item["marker"]["x"]}, {item["marker"]["y"]})  ' if line_index == 0 else ""
            draw.text((legend_x, y), prefix + line, fill=(20, 36, 48), font=BODY_FONT)
            y += 24
        y += 5

    y += 8
    draw.text((legend_x, y), "Knowledge-check markers", fill=(180, 20, 95), font=TITLE_FONT)
    y += 38
    for item in check_items:
        for line_index, line in enumerate(wrap_lines(item["text"])):
            prefix = f'{item["code"]} ({item["marker"]["x"]}, {item["marker"]["y"]})  ' if line_index == 0 else ""
            draw.text((legend_x, y), prefix + line, fill=(20, 36, 48), font=BODY_FONT)
            y += 24
        y += 5

    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path, optimize=True)


def make_contact_sheets(module_dir: Path) -> None:
    images = sorted(path for path in module_dir.glob("*.png") if not path.name.startswith("contact-"))
    page_size = 4
    for page, start in enumerate(range(0, len(images), page_size), start=1):
        tiles = []
        for image_path in images[start : start + page_size]:
            image = Image.open(image_path).convert("RGB")
            image.thumbnail((900, 700), Image.Resampling.LANCZOS)
            tile = Image.new("RGB", (920, 750), (235, 241, 245))
            tile.paste(image, ((920 - image.width) // 2, 10))
            draw = ImageDraw.Draw(tile)
            draw.text((14, 716), image_path.stem, fill=(14, 39, 56), font=SMALL_FONT)
            tiles.append(tile)
        rows = math.ceil(len(tiles) / 2)
        sheet = Image.new("RGB", (1840, rows * 750), "white")
        for index, tile in enumerate(tiles):
            sheet.paste(tile, ((index % 2) * 920, (index // 2) * 750))
        sheet.save(module_dir / f"contact-{page:02d}.png", optimize=True)


def main() -> None:
    args = parse_args()
    root = Path.cwd()
    data = json.loads(args.data.read_text())
    groups: dict[tuple[str, str], dict[str, list[dict]]] = defaultdict(
        lambda: {"tour": [], "check": []}
    )

    for module_id, trainer in data["moduleTrainers"].items():
        tour_counter = defaultdict(int)
        check_counter = defaultdict(int)
        for step in trainer["tour"]:
            for marker in step["markers"]:
                tour_counter[step["imageKey"]] += 1
                groups[(module_id, step["imageKey"])]["tour"].append(
                    {
                        "code": f'T{tour_counter[step["imageKey"]]:02d}',
                        "marker": marker,
                        "text": f'{step["title"]} | {marker.get("label", "")}',
                    }
                )
        for check in trainer["check"]:
            check_counter[check["imageKey"]] += 1
            groups[(module_id, check["imageKey"])]["check"].append(
                {
                    "code": f'C{check_counter[check["imageKey"]]:02d}',
                    "marker": check["marker"],
                    "text": f'{check["id"]} | answer: {check["options"][check["answer"]]}',
                }
            )

    for (module_id, image_key), items in groups.items():
        image_entry = data["images"][image_key]
        output_path = args.out / slug(module_id) / f"{slug(image_key)}.png"
        render_group(
            root,
            module_id,
            image_key,
            image_entry,
            items["tour"],
            items["check"],
            output_path,
        )

    for module_dir in sorted(path for path in args.out.iterdir() if path.is_dir()):
        make_contact_sheets(module_dir)


if __name__ == "__main__":
    main()
