import shutil
import os

def zip_project():
    # Go up one level to see 'agency_os' as a folder
    os.chdir('..')
    
    source_dir = "agency_os"
    output_filename = "AgencyOS_Complete_v2"
    
    if not os.path.exists(source_dir):
        # Fallback if name is different, print what we see
        print(f"Error: Directory {source_dir} not found in {os.getcwd()}")
        print(f"Contents: {os.listdir()}")
        return

    print(f"Zipping {source_dir}...")
    
    # Create zip
    shutil.make_archive(output_filename, 'zip', source_dir)
    
    output_path = os.path.abspath(f"{output_filename}.zip")
    print(f"✅ Success! Project zipped to: {output_path}")

if __name__ == "__main__":
    zip_project()
