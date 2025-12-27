import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export type JournalEntry = {
  id: string;
  placeId: string;
  placeName: string;
  note: string;
  createdAt: number;
  photoFiles?: string[]; // saved filenames in app storage
};

export type PhotoItem = {
  fileName: string;     // filename stored in app storage
  previewSrc: string;   // used in editor preview (img src)
};

@Injectable({ providedIn: 'root' })
export class JournalService {
  private key = 'toursnap_journal_entries';

  // ✅ app-private storage (offline + reliable). On Android this is internal app storage.
  private dir = Directory.Data;

  // ---------------- Journal entries ----------------

  getAll(): JournalEntry[] {
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  }

  getById(id: string): JournalEntry | null {
    return this.getAll().find((e) => e.id === id) || null;
  }

  add(entry: JournalEntry) {
    const all = this.getAll();
    all.unshift(entry);
    localStorage.setItem(this.key, JSON.stringify(all));
  }

  update(entry: JournalEntry) {
    const all = this.getAll();
    const idx = all.findIndex((e) => e.id === entry.id);
    if (idx >= 0) all[idx] = entry;
    else all.unshift(entry);
    localStorage.setItem(this.key, JSON.stringify(all));
  }

  delete(id: string) {
    const all = this.getAll().filter((e) => e.id !== id);
    localStorage.setItem(this.key, JSON.stringify(all));
  }

  // ---------------- Photos ----------------
  // Goal:
  // 1) Capture/pick -> show preview
  // 2) Also save a copy in app storage (so journal list can show later)
  // 3) Optionally save to Gallery (saveToGallery true) if user selects that option.

  async takePhotoAndSaveToAppStorage(options?: { saveToGallery?: boolean }): Promise<PhotoItem> {
    const photo = await Camera.getPhoto({
      saveToGallery: !!options?.saveToGallery,
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    return await this.persistPhotoToAppStorage(photo);
  }

  async pickFromGalleryAndSaveToAppStorage(): Promise<PhotoItem> {
    const photo = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    return await this.persistPhotoToAppStorage(photo);
  }

  private async persistPhotoToAppStorage(photo: Photo): Promise<PhotoItem> {
    if (!photo.webPath) throw new Error('No webPath from camera/photo picker');

    const fileName = `toursnap_${Date.now()}.jpeg`;
    const base64 = await this.base64FromWebPath(photo.webPath);

    await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: this.dir,
      recursive: true,
    });

    // Preview: simplest is webPath (fast) BUT after app restart webPath is gone.
    // So we use the saved file to build preview src.
    const previewSrc = await this.getDisplaySrcForSavedFile(fileName);
    return { fileName, previewSrc };
  }

  /**
   * Use this for Journal List rendering (saved entries).
   * Always returns a displayable <img [src]> string.
   */
  async getDisplaySrcForSavedFile(fileName: string): Promise<string> {
    // Native: get file uri and convert for WebView
    if (Capacitor.isNativePlatform()) {
      const uri = await Filesystem.getUri({
        directory: this.dir,
        path: fileName,
      });
      return Capacitor.convertFileSrc(uri.uri);
    }

    // Web: read base64 and build data URL
    const read = await Filesystem.readFile({
      directory: this.dir,
      path: fileName,
    });

    return `data:image/jpeg;base64,${read.data}`;
  }

  // Utility: convert photo.webPath -> base64 (without prefix)
  private async base64FromWebPath(webPath: string): Promise<string> {
    const response = await fetch(webPath);
    const blob = await response.blob();

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('FileReader failed'));
      reader.onload = () => {
        const res = reader.result as string; // data:image/jpeg;base64,...
        resolve(res.split(',')[1]);          // pure base64
      };
      reader.readAsDataURL(blob);
    });
  }
}
