import shutil
import os
import zipfile

def zip_project_clean():
    base_dir = "."
    output_filename = "AgencyOS_Deploy_Ready.zip"
    
    # Files/Dirs to exclude
    EXCLUDE_DIRS = {'node_modules', '.git', '__pycache__', 'dist', 'venv', '.gemini'}
    EXCLUDE_FILES = {'.DS_Store', 'package-lock.json'} # Optional: keep package-lock if needed, but for "clean" maybe exclude? No, keep lockfile.

    print(f"📦 Packaging Agency OS (Clean)...")
    
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(base_dir):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
            
            for file in files:
                if file in EXCLUDE_FILES:
                    continue
                if file.endswith('.zip'): # Don't zip existing zips
                    continue
                    
                file_path = os.path.join(root, file)
                # Create relative path for archive
                archive_name = os.path.relpath(file_path, base_dir)
                
                print(f"  Adding: {archive_name}")
                zipf.write(file_path, archive_name)

    output_path = os.path.abspath(output_filename)
    print(f"✅ Success! Clean package created at: {output_path}")

if __name__ == "__main__":
    zip_project_clean()
