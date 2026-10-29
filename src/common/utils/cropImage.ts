/**
 * Utility untuk menghasilkan gambar hasil crop dari canvas.
 */

export interface CroppedArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * Membuat elemen Image dari URL.
 */
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });
}

/**
 * Menghitung bounding box baru dari gambar yang sudah dirotasi.
 */
function getRadianAngle(degreeValue: number): number {
    return (degreeValue * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = getRadianAngle(rotation);
    return {
        width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

/**
 * Menghasilkan file hasil crop dari `imageSrc` berdasarkan `croppedAreaPixels`.
 * Mendukung rotasi. Mengembalikan `File` object yang siap diupload.
 */
export async function getCroppedImg(
    imageSrc: string,
    croppedAreaPixels: CroppedArea,
    fileName = "cropped-image.jpg",
    rotation = 0
): Promise<File> {
    const image = await createImage(imageSrc);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Tidak bisa membuat canvas context");
    }

    const rotRad = getRadianAngle(rotation);

    // Calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    );

    // Set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // Translate canvas center to match rotated image center
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    // Draw rotated image
    ctx.drawImage(image, 0, 0);

    // Extract cropped area
    const croppedCanvas = document.createElement("canvas");
    const croppedCtx = croppedCanvas.getContext("2d");

    if (!croppedCtx) {
        throw new Error("Tidak bisa membuat cropped canvas context");
    }

    croppedCanvas.width = croppedAreaPixels.width;
    croppedCanvas.height = croppedAreaPixels.height;

    croppedCtx.drawImage(
        canvas,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
    );

    return new Promise((resolve, reject) => {
        croppedCanvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Canvas kosong"));
                    return;
                }
                const file = new File([blob], fileName, {
                    type: "image/jpeg",
                    lastModified: Date.now(),
                });
                resolve(file);
            },
            "image/jpeg",
            0.92
        );
    });
}
