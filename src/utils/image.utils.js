/**
 * Compresses an image file to a specified quality.
 * @param {File} file - The original image file.
 * @param {number} quality - Compression quality (0 to 1). Default is 0.7 (70%).
 * @returns {Promise<File>} - A promise that resolves with the compressed File object.
 */
export const compressImage = async (file, quality = 0.7) => {
    // If it's not an image or it's a small SVG/GIF that might lose transparency or animation, skip
    if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // We can also add max width/height here if needed
                // For now, just maintain original dimensions
                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // If quality < 1, we force image/jpeg to ensure real compression 
                // (image/png ignores the quality parameter)
                const outputType = (quality < 1 && file.type !== "image/gif") ? "image/jpeg" : file.type;
                const extension = outputType === "image/jpeg" ? ".jpg" : "";

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Canvas to Blob failed"));
                            return;
                        }
                        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + extension, {
                            type: outputType,
                            lastModified: Date.now(),
                        });

                        resolve(compressedFile);
                    },
                    outputType,
                    quality
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
