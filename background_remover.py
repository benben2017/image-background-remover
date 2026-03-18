#!/usr/bin/env python3
"""
Image Background Remover
AI-powered tool for removing backgrounds from images.
"""

from rembg import remove
from PIL import Image
import argparse
import os


def remove_background(input_path: str, output_path: str = None) -> str:
    """
    Remove background from an image.
    
    Args:
        input_path: Path to input image
        output_path: Path to save output (optional)
    
    Returns:
        Path to output image
    """
    if output_path is None:
        name, ext = os.path.splitext(input_path)
        output_path = f"{name}_no_bg.png"
    
    # Load image
    input_image = Image.open(input_path)
    
    # Remove background
    output_image = remove(input_image)
    
    # Save result
    output_image.save(output_path)
    
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Remove background from images")
    parser.add_argument("input", help="Input image path")
    parser.add_argument("-o", "--output", help="Output image path")
    
    args = parser.parse_args()
    
    output = remove_background(args.input, args.output)
    print(f"Background removed! Saved to: {output}")


if __name__ == "__main__":
    main()