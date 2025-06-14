// image-viewer.js - 图片浏览功能
// =====================================================

class ImageViewerModule {
    static currentImages = [];
    static currentIndex = 0;

    /**
     * 初始化图片浏览器
     */
    static init() {
        this.bindEvents();
    }

    /**
     * 绑定事件
     */
    static bindEvents() {
        const prevBtn = document.getElementById('prev-image');
        const nextBtn = document.getElementById('next-image');

        prevBtn.addEventListener('click', () => this.showPreviousImage());
        nextBtn.addEventListener('click', () => this.showNextImage());

        // 添加键盘事件支持
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.showPreviousImage();
            } else if (e.key === 'ArrowRight') {
                this.showNextImage();
            }
        });
    }

    /**
     * 显示指定形状的图片
     */
    static showImages(shapeName) {
        // 预定义每个形状的图片列表
        const imageMap = {
            'square': [
                'real/square/square1.jpg',
                'real/square/square2.jpg',
                'real/square/square3.jpg'
            ],
            'rectangle': [
                'real/rectangle/rectangle1.jpg',
                'real/rectangle/rectangle2.jpg',
                'real/rectangle/rectangle3.jpg'
            ],
            'rhombus': [
                'real/rhombus/rhombus1.jpg',
                'real/rhombus/rhombus2.jpg',
                'real/rhombus/rhombus3.jpg'
            ],
            'parallelogram': [
                'real/parallelogram/parallelogram1.jpg',
                'real/parallelogram/parallelogram2.jpg',
                'real/parallelogram/parallelogram3.jpg'
            ],
            'trapezoid': [
                'real/trapezoid/trapezoid1.jpg',
                'real/trapezoid/trapezoid2.jpg',
                'real/trapezoid/trapezoid3.jpg'
            ]
        };

        this.currentImages = imageMap[shapeName] || [];
        this.currentIndex = 0;
        this.updateImageDisplay();
    }

    /**
     * 更新图片显示
     */
    static updateImageDisplay() {
        const imageViewer = document.getElementById('image-viewer');
        const currentImage = document.getElementById('current-image');
        const imageCounter = document.getElementById('image-counter');
        const prevBtn = document.getElementById('prev-image');
        const nextBtn = document.getElementById('next-image');

        if (this.currentImages.length === 0) {
            imageViewer.style.display = 'none';
            return;
        }

        imageViewer.style.display = 'block';
        currentImage.src = this.currentImages[this.currentIndex];
        imageCounter.textContent = `${this.currentIndex + 1}/${this.currentImages.length}`;

        // 更新按钮状态
        prevBtn.disabled = this.currentIndex === 0;
        nextBtn.disabled = this.currentIndex === this.currentImages.length - 1;
    }

    /**
     * 显示上一张图片
     */
    static showPreviousImage() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateImageDisplay();
        }
    }

    /**
     * 显示下一张图片
     */
    static showNextImage() {
        if (this.currentIndex < this.currentImages.length - 1) {
            this.currentIndex++;
            this.updateImageDisplay();
        }
    }

    /**
     * 隐藏图片浏览器
     */
    static hide() {
        const imageViewer = document.getElementById('image-viewer');
        imageViewer.style.display = 'none';
    }
}

// 导出模块
window.ImageViewerModule = ImageViewerModule; 