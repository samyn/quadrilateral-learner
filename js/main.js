// main.js - 主控制器和事件处理
// =====================================================

// 全局状态管理
window.AppState = {
    currentShape: 'square',
    isAnimating: false,
    isComparisonMode: false,
    isRelationshipDiagramMode: false,
    isChallengeMode: false,
    animationState: {
        sourceShape: null,
        targetShape: null,
        isActive: false
    },
    challengeState: {
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        wrongQuestions: [],
        totalQuestions: 10,
        isAnswered: false
    }
};

// 主应用控制器
class AppController {
    constructor() {
        this.initialized = false;
        // 等待 DOM 加载完成后再初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        console.log('Initializing modules...');
        
        // 检查模块是否存在并初始化
        if (window.ShapeModule && typeof window.ShapeModule.init === 'function') {
            window.ShapeModule.init();
            console.log('ShapeModule initialized');
        } else {
            console.error('ShapeModule not available');
        }
        
        if (window.RelationshipModule && typeof window.RelationshipModule.init === 'function') {
            window.RelationshipModule.init();
            console.log('RelationshipModule initialized');
        } else {
            console.error('RelationshipModule not available or init is not a function');
        }
        
        if (window.ChallengeModule && typeof window.ChallengeModule.init === 'function') {
            window.ChallengeModule.init();
            console.log('ChallengeModule initialized');
        } else {
            console.error('ChallengeModule not available');
        }
        
        if (window.ImageViewerModule && typeof window.ImageViewerModule.init === 'function') {
            window.ImageViewerModule.init();
            console.log('ImageViewerModule initialized');
        } else {
            console.error('ImageViewerModule not available');
        }
        
        // 然后初始化应用
        this.init();
    }

    /**
     * 初始化应用
     */
    async init() {
        if (this.initialized) return;

        try {
            // 预加载题目数据
            console.log('开始预加载题目数据...');
            await window.AppUtils.DataLoader.loadPracticesData();
            
            // 绑定事件监听器
            this.bindEventListeners();
            
            // 初始化显示
            if (window.ShapeModule && typeof window.ShapeModule.displayShape === 'function') {
                window.ShapeModule.displayShape('square');
            }
            this.updateActiveShape('square');
            
            this.initialized = true;
            console.log('应用初始化完成');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            if (window.AppUtils && window.AppUtils.UIUtils) {
                window.AppUtils.UIUtils.showErrorMessage('应用初始化失败');
            }
        }
    }

    /**
     * 绑定所有事件监听器
     */
    bindEventListeners() {
        // 形状按钮事件
        this.bindShapeButtons();
        
        // 关系图按钮事件
        this.bindRelationshipButton();
        
        // 挑战按钮事件
        this.bindChallengeButton();
        
        // 挑战界面事件
        this.bindChallengeEvents();
        
        // 结果界面事件
        this.bindResultEvents();
        
        // 关系图交互事件
        this.bindRelationshipDiagramEvents();
        
        // 全局点击事件
        this.bindGlobalEvents();
    }

    /**
     * 绑定形状按钮事件
     */
    bindShapeButtons() {
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleShapeSelection(btn.dataset.shape);
            });
        });
    }

    /**
     * 绑定关系图按钮事件
     */
    bindRelationshipButton() {
        const relationshipBtn = document.getElementById('relationship-diagram-btn');
        if (relationshipBtn) {
            relationshipBtn.addEventListener('click', () => {
                if (window.AppState.isRelationshipDiagramMode) {
                    if (window.RelationshipModule && typeof window.RelationshipModule.hideRelationshipDiagram === 'function') {
                        window.RelationshipModule.hideRelationshipDiagram();
                    }
                    this.handleShapeSelection(window.AppState.currentShape);
                } else {
                    if (window.RelationshipModule && typeof window.RelationshipModule.showRelationshipDiagram === 'function') {
                        window.RelationshipModule.showRelationshipDiagram();
                    }
                }
            });
        }
    }

    /**
     * 绑定挑战按钮事件
     */
    bindChallengeButton() {
        const challengeBtn = document.getElementById('challenge-btn');
        if (challengeBtn) {
            challengeBtn.addEventListener('click', async () => {
                if (window.AppState.isChallengeMode) {
                    if (window.ChallengeModule && typeof window.ChallengeModule.exitChallenge === 'function') {
                        window.ChallengeModule.exitChallenge();
                    }
                } else {
                    if (window.ChallengeModule && typeof window.ChallengeModule.startChallenge === 'function') {
                        await window.ChallengeModule.startChallenge();
                    }
                }
            });
        }
    }

    /**
     * 绑定挑战界面事件
     */
    bindChallengeEvents() {
        // 答题按钮
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const answer = e.target.dataset.answer === 'true';
                if (window.ChallengeModule && typeof window.ChallengeModule.handleAnswer === 'function') {
                    window.ChallengeModule.handleAnswer(answer);
                }
            });
        });

        // 重置进度按钮
        const resetBtn = document.getElementById('reset-progress-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (window.ChallengeModule && typeof window.ChallengeModule.showResetConfirmationDialog === 'function') {
                    window.ChallengeModule.showResetConfirmationDialog();
                }
            });
        }
    }

    /**
     * 绑定结果界面事件
     */
    bindResultEvents() {
        // 重新挑战按钮
        const restartBtn = document.getElementById('restart-challenge-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                if (window.ChallengeModule && typeof window.ChallengeModule.restartChallenge === 'function') {
                    window.ChallengeModule.restartChallenge();
                }
            });
        }

        // 返回首页按钮
        const homeBtn = document.getElementById('result-home-btn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                if (window.ChallengeModule && typeof window.ChallengeModule.exitChallenge === 'function') {
                    window.ChallengeModule.exitChallenge();
                }
            });
        }
    }

    /**
     * 绑定关系图交互事件
     */
    bindRelationshipDiagramEvents() {
        // 关系图中图形区域的点击事件
        document.querySelectorAll('#relationship-svg rect[data-shape]').forEach(rect => {
            rect.addEventListener('click', (e) => {
                e.stopPropagation();
                const shapeName = rect.getAttribute('data-shape');
                if (shapeName && window.AppData && window.AppData.SHAPES_DATA && window.AppData.SHAPES_DATA[shapeName]) {
                    if (window.RelationshipModule && typeof window.RelationshipModule.hideRelationshipDiagram === 'function') {
                        window.RelationshipModule.hideRelationshipDiagram();
                    }
                    this.handleShapeSelection(shapeName);
                }
            });
        });

        // 处理长方形和菱形的hover效果
        this.bindRelationshipHoverEffects();

        // 关系图中可点击文本的事件
        this.bindRelationshipTextEvents();
    }

    /**
     * 绑定关系图hover效果
     */
    bindRelationshipHoverEffects() {
        const rectangleRect = document.querySelector('#relationship-svg rect[data-shape="rectangle"]');
        const rhombusRect = document.querySelector('#relationship-svg rect[data-shape="rhombus"]');
        const squareRect = document.querySelector('#relationship-svg rect[data-shape="square"]');

        if (rectangleRect && squareRect && rhombusRect) {
            rectangleRect.addEventListener('mouseenter', () => {
                squareRect.classList.add('dimmed');
                rhombusRect.classList.add('dimmed');
            });
            
            rectangleRect.addEventListener('mouseleave', () => {
                squareRect.classList.remove('dimmed');
                rhombusRect.classList.remove('dimmed');
            });
        }

        if (rhombusRect && squareRect) {
            rhombusRect.addEventListener('mouseenter', () => {
                squareRect.classList.add('dimmed');
            });
            
            rhombusRect.addEventListener('mouseleave', () => {
                squareRect.classList.remove('dimmed');
            });
        }
    }

    /**
     * 绑定关系图文本事件
     */
    bindRelationshipTextEvents() {
        document.querySelectorAll('#relationship-svg text[style*="cursor: pointer"]').forEach(text => {
            text.addEventListener('click', (e) => {
                e.stopPropagation();
                const textContent = text.textContent;
                let shapeName = null;
                
                if (textContent.includes('梯形')) shapeName = 'trapezoid';
                else if (textContent.includes('長方形')) shapeName = 'rectangle';
                else if (textContent.includes('菱形')) shapeName = 'rhombus';
                else if (textContent.includes('正方形')) shapeName = 'square';
                else if (textContent.includes('平行四邊形')) shapeName = 'parallelogram';
                
                if (shapeName) {
                    if (window.RelationshipModule && typeof window.RelationshipModule.hideRelationshipDiagram === 'function') {
                        window.RelationshipModule.hideRelationshipDiagram();
                    }
                    this.handleShapeSelection(shapeName);
                }
            });
        });
    }

    /**
     * 绑定全局事件
     */
    bindGlobalEvents() {
        // 点击空白处重置选择状态
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.shape-node') && 
                !e.target.closest('.relationship-info') &&
                !e.target.closest('.property') &&
                !e.target.closest('.property-comparison') &&
                !e.target.closest('.animation-controls') &&
                !e.target.closest('.transformation-progress')) {
                
                if (window.ShapeModule && typeof window.ShapeModule.resetTransformationState === 'function') {
                    window.ShapeModule.resetTransformationState();
                }
                
                document.querySelectorAll('.property').forEach(p => {
                    p.classList.remove('highlight');
                });
                
                document.querySelectorAll('.property-comparison').forEach(row => {
                    row.style.boxShadow = '0 3px 6px rgba(0,0,0,0.08)';
                    row.style.transform = 'scale(1)';
                });
                
                if (window.ShapeModule && typeof window.ShapeModule.clearVisualHighlights === 'function') {
                    window.ShapeModule.clearVisualHighlights();
                }
            }
        });

        // 键盘事件（可选）
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    /**
     * 处理形状选择
     */
    handleShapeSelection(shapeName) {
        // 如果当前在关系图模式，先切换回形状显示
        if (window.AppState.isRelationshipDiagramMode) {
            if (window.RelationshipModule && typeof window.RelationshipModule.hideRelationshipDiagram === 'function') {
                window.RelationshipModule.hideRelationshipDiagram();
            }
        }
        
        if (window.ShapeModule && typeof window.ShapeModule.resetTransformationState === 'function') {
            window.ShapeModule.resetTransformationState();
        }
        this.updateActiveShape(shapeName);
        if (window.ShapeModule && typeof window.ShapeModule.displayShape === 'function') {
            window.ShapeModule.displayShape(shapeName);
        }
        window.AppState.currentShape = shapeName;
    }

    /**
     * 更新活动形状按钮
     */
    updateActiveShape(shapeName) {
        document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`[data-shape="${shapeName}"]`);
        if (btn) btn.classList.add('active');
    }

    /**
     * 处理键盘快捷键（可选功能）
     */
    handleKeyboardShortcuts(e) {
        // ESC键退出当前模式
        if (e.key === 'Escape') {
            if (window.AppState.isChallengeMode) {
                if (window.ChallengeModule && typeof window.ChallengeModule.exitChallenge === 'function') {
                    window.ChallengeModule.exitChallenge();
                }
            } else if (window.AppState.isRelationshipDiagramMode) {
                if (window.RelationshipModule && typeof window.RelationshipModule.hideRelationshipDiagram === 'function') {
                    window.RelationshipModule.hideRelationshipDiagram();
                }
                this.handleShapeSelection(window.AppState.currentShape);
            }
        }

        // 数字键快速选择形状
        const shapeKeys = {
            '1': 'square',
            '2': 'rectangle', 
            '3': 'rhombus',
            '4': 'parallelogram',
            '5': 'trapezoid'
        };

        if (shapeKeys[e.key] && !window.AppState.isChallengeMode) {
            this.handleShapeSelection(shapeKeys[e.key]);
        }

        // 空格键显示关系图
        if (e.key === ' ' && !window.AppState.isChallengeMode) {
            e.preventDefault();
            if (window.AppState.isRelationshipDiagramMode) {
                if (window.RelationshipModule && typeof window.RelationshipModule.hideRelationshipDiagram === 'function') {
                    window.RelationshipModule.hideRelationshipDiagram();
                }
                this.handleShapeSelection(window.AppState.currentShape);
            } else {
                if (window.RelationshipModule && typeof window.RelationshipModule.showRelationshipDiagram === 'function') {
                    window.RelationshipModule.showRelationshipDiagram();
                }
            }
        }
    }

    /**
     * 应用状态更新方法
     */
    updateAppState(newState) {
        Object.assign(window.AppState, newState);
        
        // 触发状态变化事件
        document.dispatchEvent(new CustomEvent('appStateChanged', {
            detail: { newState: window.AppState }
        }));
    }

    /**
     * 错误处理
     */
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        if (window.AppUtils && window.AppUtils.UIUtils) {
            window.AppUtils.UIUtils.showErrorMessage(
                context ? `${context}發生錯誤` : '發生未知錯誤'
            );
        }
    }
}

// 创建全局应用实例
window.App = new AppController();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    try {
        await window.App.init();
    } catch (error) {
        console.error('应用启动失败:', error);
        if (window.AppUtils && window.AppUtils.UIUtils) {
            window.AppUtils.UIUtils.showErrorMessage('应用启动失败，请刷新页面重试');
        }
    }
});

// 导出应用控制器（如果使用ES6模块）
// export { AppController };