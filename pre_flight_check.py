import os
import sys
import importlib

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

def check_file_exists(path):
    if os.path.exists(path):
        print(f"✅ Found: {path}")
        return True
    else:
        print(f"❌ MISSING: {path}")
        return False

def check_backend_import(module_name):
    try:
        importlib.import_module(module_name)
        print(f"✅ Imported Backend Module: {module_name}")
        return True
    except Exception as e:
        print(f"❌ FAILED to Import {module_name}: {e}")
        return False

def run_pre_flight():
    print("--- 🛫 PRE-FLIGHT CHECK SEQUENCE 🛫 ---")
    
    # 1. Frontend Structure Check
    print("\n[FRONTEND CORE]")
    frontend_files = [
        "frontend/src/App.jsx",
        "frontend/src/main.jsx",
        "frontend/src/pages/Dashboard.jsx",
        "frontend/src/store/agencyStore.js",
    ]
    
    frontend_components = [
        "frontend/src/components/CompetitorSpy.jsx",
        "frontend/src/components/TheVault.jsx",
        "frontend/src/components/MockupPreviewModal.jsx",
        "frontend/src/components/StrategyGenerator.jsx",
        "frontend/src/components/EditorialCalendar.jsx",
        "frontend/src/components/VideoStudio.jsx",
        "frontend/src/components/ClientList.jsx",
        "frontend/src/components/ChameleonEngine.jsx",
    ]
    
    all_files = frontend_files + frontend_components
    missing_files = []
    
    for f in all_files:
        if not check_file_exists(f):
            missing_files.append(f)
            
    if missing_files:
        print(f"\n⚠️ CRITICAL: {len(missing_files)} frontend files are missing!")
        sys.exit(1)
        
    # 2. Backend Import Check (Syntax & Dependencies)
    print("\n[BACKEND LOGIC]")
    backend_modules = [
        "backend.main",
        "backend.routers.strategy",
        "backend.routers.posts",
        "backend.routers.clients",
        "backend.routers.audio",
        "backend.services.creative_director",
        "backend.services.copywriter",
        "backend.services.audio_studio",
        "backend.services.export_service"
    ]
    
    failed_imports = []
    for mod in backend_modules:
        if not check_backend_import(mod):
            failed_imports.append(mod)
            
    if failed_imports:
        print(f"\n⚠️ CRITICAL: {len(failed_imports)} backend modules failed to load!")
        sys.exit(1)

    print("\n✅ PRE-FLIGHT CHECK PASSED. SYSTEM READY FOR DEPLOYMENT.")

if __name__ == "__main__":
    run_pre_flight()
