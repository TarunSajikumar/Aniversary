import os
from PIL import Image

def compress_images():
    assets_dir = os.path.join(os.path.dirname(__file__), "assets")
    if not os.path.exists(assets_dir):
        print(f"Error: Folder '{assets_dir}' not found.")
        return

    supported_extensions = ('.jpg', '.jpeg', '.png')
    max_dimension = 1920
    quality = 85

    files = [f for f in os.listdir(assets_dir) if f.lower().endswith(supported_extensions)]
    print(f"Found {len(files)} images to compress in assets folder.")

    for filename in files:
        filepath = os.path.join(assets_dir, filename)
        try:
            with Image.open(filepath) as img:
                # Get original dimensions
                width, height = img.size
                
                # Check if we need to resize
                if width > max_dimension or height > max_dimension:
                    if width > height:
                        new_width = max_dimension
                        new_height = int((height / width) * max_dimension)
                    else:
                        new_height = max_dimension
                        new_width = int((width / height) * max_dimension)
                    
                    # Use Resampling.LANCZOS for high quality resizing
                    img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                    print(f"Resized {filename} from {width}x{height} to {new_width}x{new_height}")

                # Save as WebP
                base_name = os.path.splitext(filename)[0]
                webp_filename = f"{base_name}.webp"
                webp_filepath = os.path.join(assets_dir, webp_filename)

                # Save the image
                img.save(webp_filepath, "WEBP", quality=quality)
                
                # Check sizes
                orig_size = os.path.getsize(filepath)
                new_size = os.path.getsize(webp_filepath)
                savings = (orig_size - new_size) / (1024 * 1024)
                print(f"Compressed {filename} -> {webp_filename} ({orig_size/(1024*1024):.2f}MB -> {new_size/1024:.1f}KB, Saved {savings:.2f}MB)")

            # Delete the original file
            os.remove(filepath)
            print(f"Removed original file: {filename}")
        except Exception as e:
            print(f"Failed to compress {filename}: {e}")

if __name__ == "__main__":
    compress_images()
