declare module 'lightgallery.js' {
  interface LightGallerySettings {
    selector: string;
    download?: boolean;
    getCaptionFromTitleOrAlt?: boolean;
    showAfterLoad?: boolean;
    counter?: boolean;
    enableDrag?: boolean;
    enableSwipe?: boolean;
    speed?: number;
  }

  interface LightGallery {
    (element: HTMLElement, settings?: LightGallerySettings): {
      destroy: () => void;
      refresh: () => void;
    };
  }

  const lightGallery: LightGallery;
  export default lightGallery;
}
