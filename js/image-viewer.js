// image-viewer.js - 图片浏览功能
// =====================================================

class ImageViewerModule {
    static currentImages = [];
    static currentIndex = 0;

    /**
     * 初始化图片浏览器
     */
    static init() {
        console.log('Initializing ImageViewerModule...'); // 添加调试日志
        this.bindEvents();
        console.log('ImageViewerModule initialized.'); // 添加调试日志
    }

    /**
     * 绑定事件
     */
    static bindEvents() {
        // 绑定tab切换事件
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // 绑定图片导航按钮事件
        const prevBtn = document.getElementById('prev-image');
        const nextBtn = document.getElementById('next-image');

        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPreviousImage();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNextImage();
            });
        }

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
     * 切换标签页
     */
    static switchTab(tabName) {
        console.log('Switching to tab:', tabName); // 添加调试日志
        
        // 更新按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            const isActive = btn.getAttribute('data-tab') === tabName;
            btn.classList.toggle('active', isActive);
            console.log('Button:', btn.getAttribute('data-tab'), 'isActive:', isActive); // 添加调试日志
        });

        // 更新面板显示
        document.querySelectorAll('.tab-panel').forEach(panel => {
            const isActive = panel.id === `${tabName}-tab`;
            panel.classList.toggle('active', isActive);
            console.log('Panel:', panel.id, 'isActive:', isActive); // 添加调试日志
        });
    }

    /**
     * 显示指定形状的图片
     */
    static showImages(shapeName) {
        // 从配置中获取图片列表
        this.currentImages = window.IMAGE_CONFIG.images[shapeName] || [];
        this.currentIndex = 0;
        
        // 预加载第一张图片
        if (this.currentImages.length > 0) {
            const img = new Image();
            img.onload = () => {
                this.updateImageDisplay();
                // 切换到图片标签页
                this.switchTab('image');
            };
            img.src = this.currentImages[0];
        } else {
            this.updateImageDisplay();
        }
    }

    /**
     * 更新图片显示
     */
    static updateImageDisplay() {
        const currentImage = document.getElementById('current-image');
        const imageCounter = document.getElementById('image-counter');
        const prevBtn = document.getElementById('prev-image');
        const nextBtn = document.getElementById('next-image');

        if (this.currentImages.length === 0) {
            currentImage.src = '';
            imageCounter.textContent = '0/0';
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }

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