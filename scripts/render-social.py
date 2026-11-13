"""Regenerate the social PNG. Development-only tools: Pillow and Inkscape."""

from pathlib import Path
import shutil
import subprocess
import tempfile

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "site" / "assets"
SCALE = 2
PLUM = "#262229"
CREAM = "#F7F8F2"
CORAL = "#EE8B73"
MUTED = "#B8B2BB"


def font(size, weight=500):
    face = ImageFont.truetype(
        str(ASSETS / "fonts/manrope-latin-wght-5.3.0.woff2"), size * SCALE
    )
    face.set_variation_by_axes([weight])
    return face


def tracked_text(draw, text, x, y, size, color, tracking=0):
    face = font(size)
    cursor = x * SCALE
    baseline = y * SCALE - face.getbbox(text, anchor="ls")[1]
    for character in text:
        draw.text((cursor, baseline), character, font=face, fill=color, anchor="ls")
        cursor += face.getlength(character) + tracking * SCALE


def main():
    inkscape = shutil.which("inkscape")
    if not inkscape:
        raise SystemExit("Install Inkscape to rasterize the original SVG wordmark.")

    canvas = Image.new("RGB", (1200 * SCALE, 630 * SCALE), PLUM)
    draw = ImageDraw.Draw(canvas)

    with tempfile.TemporaryDirectory(prefix="root-social-") as temporary:
        logo_path = Path(temporary) / "wordmark.png"
        subprocess.run(
            [inkscape, str(ASSETS / "brand/root-barlow-lockup-dark-transparent.svg"),
             "--export-type=png", f"--export-width={210 * SCALE}",
             f"--export-filename={logo_path}"],
            check=True, capture_output=True,
        )
        with Image.open(logo_path) as logo:
            canvas.paste(logo, (63 * SCALE, 46 * SCALE), logo)

    tracked_text(draw, "Beyond consuming.", 80, 220, 88, CREAM, -4.6)
    tracked_text(draw, "Start creating.", 80, 324, 88, CORAL, -4.6)
    draw.line((80 * SCALE, 490 * SCALE, 1120 * SCALE, 490 * SCALE),
              fill="#403A43", width=SCALE)
    draw.text((80 * SCALE, 527 * SCALE), "Independent. Student-led. Jordan.",
              font=font(17), fill=MUTED, anchor="lt")
    draw.text((1120 * SCALE, 527 * SCALE), "rootamman.com",
              font=font(17), fill=MUTED, anchor="rt")

    destination = ASSETS / "social/root-og.png"
    canvas.resize((1200, 630), Image.Resampling.LANCZOS).save(destination, optimize=True)
    print(f"Saved {destination.relative_to(ROOT)} (1200 × 630)")


if __name__ == "__main__":
    main()
