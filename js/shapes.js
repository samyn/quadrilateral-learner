// shapes.js - 形状显示和动画功能
// =====================================================

// 形状模块
class ShapeModule {
    
    /**
     * 显示指定形状
     */
    static displayShape(shapeName) {
        if (window.AppState.isAnimating) return;
        
        const shape = window.AppData.SHAPES_DATA[shapeName];
        if (!shape) return;
        
        const polygon = document.getElementById('main-shape');
        const title = document.getElementById('shape-title');
        const propertiesList = document.getElementById('properties-list');

        polygon.classList.add('morphing');
        
        setTimeout(() => {
            polygon.setAttribute('points', shape.points);
            polygon.classList.remove('morphing');
            this.updateVisualMarkers(shapeName);
        }, 200);

        title.textContent = shape.title;
        this.clearVisualHighlights();
        
        this.populateProperties(shape, propertiesList);
        
        window.AppState.currentShape = shapeName;
        window.AppState.isComparisonMode = false;
        
        // 更新变换区域显示
        this.updateTransformationArea(shapeName);

        // 显示对应形状的图片
        window.ImageViewerModule.showImages(shapeName);
    }

    /**
     * 填充属性列表
     */
    static populateProperties(shape, propertiesList) {
        propertiesList.innerHTML = '';
        
        shape.properties.forEach((prop, index) => {
            setTimeout(() => {
                const propertyDiv = document.createElement('div');
                propertyDiv.className = 'property';
                propertyDiv.style.transform = 'translateX(0)';
                propertyDiv.style.opacity = '1';
                propertyDiv.innerHTML = `
                    <div class="property-icon ${prop.icon}"></div>
                    <span>${prop.text}</span>
                `;
                
                propertyDiv.addEventListener('click', () => {
                    document.querySelectorAll('.property').forEach(p => {
                        p.classList.remove('highlight');
                    });
                    
                    propertyDiv.classList.add('highlight');
                    
                    if (prop.visual) {
                        this.highlightVisualElement(prop.visual);
                    }
                });
                
                propertiesList.appendChild(propertyDiv);
            }, index * 200);
        });
    }

    /**
     * 更新视觉标记
     */
    static updateVisualMarkers(shapeName) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
        if (!shape || !shape.visualElements) return;
        
        const points = shape.points.split(' ').map(p => {
            const [x, y] = p.split(',').map(Number);
            return { x, y };
        });

        // 清除所有标记
        document.querySelectorAll('.visual-element').forEach(el => {
            el.style.display = 'none';
        });

        // 清除所有角度标记
        this.clearAngleMarkers();

        // 设置各种标记
        this.setParallelMarkers(shapeName, points);
        this.setAngleMarkers(shapeName, points);
        this.setEqualMarkers(shapeName, points);
        this.setDiagonalMarkers(shapeName, points);
    }

    /**
     * 清除角度标记
     */
    static clearAngleMarkers() {
        for (let i = 1; i <= 4; i++) {
            const angleDot = document.getElementById(`angle-dot${i}`);
            if (angleDot) {
                angleDot.setAttribute('r', '0');
                angleDot.setAttribute('cx', '0');
                angleDot.setAttribute('cy', '0');
            }
        }
    }

    /**
     * 设置平行线标记
     */
    static setParallelMarkers(shapeName, points) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
        if (!shape.visualElements.parallel?.show) return;

        const parallelMarks = document.getElementById('parallel-marks');
        parallelMarks.style.display = 'block';
        
        if (shapeName === 'trapezoid') {
            this.setTrapezoidParallelMarkers(points);
        } else {
            this.setRegularParallelMarkers(points);
        }
    }

    /**
     * 设置梯形平行线标记
     */
    static setTrapezoidParallelMarkers(points) {
        const topMidX = (points[0].x + points[1].x) / 2;
        const topMidY = (points[0].y + points[1].y) / 2;
        const bottomMidX = (points[2].x + points[3].x) / 2;
        const bottomMidY = (points[2].y + points[3].y) / 2;
        
        const parallel1a = document.getElementById('parallel1a');
        const parallel1b = document.getElementById('parallel1b');
        if (parallel1a && parallel1b) {
            parallel1a.setAttribute('x1', topMidX - 8);
            parallel1a.setAttribute('y1', topMidY - 5);
            parallel1a.setAttribute('x2', topMidX + 8);
            parallel1a.setAttribute('y2', topMidY - 5);
            
            parallel1b.setAttribute('x1', bottomMidX - 8);
            parallel1b.setAttribute('y1', bottomMidY + 5);
            parallel1b.setAttribute('x2', bottomMidX + 8);
            parallel1b.setAttribute('y2', bottomMidY + 5);
        }
        
        // 隐藏第二组平行线
        const parallel2a = document.getElementById('parallel2a');
        const parallel2b = document.getElementById('parallel2b');
        if (parallel2a && parallel2b) {
            parallel2a.setAttribute('x1', 0);
            parallel2a.setAttribute('y1', 0);
            parallel2a.setAttribute('x2', 0);
            parallel2a.setAttribute('y2', 0);
            
            parallel2b.setAttribute('x1', 0);
            parallel2b.setAttribute('y1', 0);
            parallel2b.setAttribute('x2', 0);
            parallel2b.setAttribute('y2', 0);
        }
    }

    /**
     * 设置常规平行线标记
     */
    static setRegularParallelMarkers(points) {
        // 上下边平行线
        const topMidX = (points[0].x + points[1].x) / 2;
        const topMidY = (points[0].y + points[1].y) / 2;
        const bottomMidX = (points[2].x + points[3].x) / 2;
        const bottomMidY = (points[2].y + points[3].y) / 2;
        
        const parallel1a = document.getElementById('parallel1a');
        const parallel1b = document.getElementById('parallel1b');
        if (parallel1a && parallel1b) {
            parallel1a.setAttribute('x1', topMidX - 8);
            parallel1a.setAttribute('y1', topMidY - 5);
            parallel1a.setAttribute('x2', topMidX + 8);
            parallel1a.setAttribute('y2', topMidY - 5);
            
            parallel1b.setAttribute('x1', bottomMidX - 8);
            parallel1b.setAttribute('y1', bottomMidY + 5);
            parallel1b.setAttribute('x2', bottomMidX + 8);
            parallel1b.setAttribute('y2', bottomMidY + 5);
        }

        // 左右边平行线
        const leftMidX = (points[0].x + points[3].x) / 2;
        const leftMidY = (points[0].y + points[3].y) / 2;
        const rightMidX = (points[1].x + points[2].x) / 2;
        const rightMidY = (points[1].y + points[2].y) / 2;
        
        const parallel2a = document.getElementById('parallel2a');
        const parallel2b = document.getElementById('parallel2b');
        if (parallel2a && parallel2b) {
            parallel2a.setAttribute('x1', leftMidX - 5);
            parallel2a.setAttribute('y1', leftMidY - 8);
            parallel2a.setAttribute('x2', leftMidX - 5);
            parallel2a.setAttribute('y2', leftMidY + 8);
            
            parallel2b.setAttribute('x1', rightMidX + 5);
            parallel2b.setAttribute('y1', rightMidY - 8);
            parallel2b.setAttribute('x2', rightMidX + 5);
            parallel2b.setAttribute('y2', rightMidY + 8);
        }
    }

    /**
     * 设置角度标记
     */
    static setAngleMarkers(shapeName, points) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
        
        // 设置直角标记
        if (shape.visualElements.rightAngle?.show) {
            this.setRightAngleMarkers(points);
        }

        // 设置一般角度标记
        if (shape.visualElements.generalAngle?.show) {
            this.setGeneralAngleMarkers(shapeName, points);
        }
    }

    /**
     * 设置直角标记
     */
    static setRightAngleMarkers(points) {
        const angleMarks = document.getElementById('angle-marks');
        angleMarks.style.display = 'block';
        
        for (let i = 0; i < 4; i++) {
            const angle = document.getElementById(`angle${i + 1}`);
            if (angle) {
                const corner = points[i];
                angle.setAttribute('x', corner.x - 7.5);
                angle.setAttribute('y', corner.y - 7.5);
            }
        }
    }

    /**
     * 设置一般角度标记
     */
    static setGeneralAngleMarkers(shapeName, points) {
        const angleMarksGeneral = document.getElementById('angle-marks-general');
        angleMarksGeneral.style.display = 'block';
        
        if (shapeName === 'rhombus') {
            this.setRhombusAngleMarkers(points);
        } else if (shapeName === 'parallelogram') {
            this.setParallelogramAngleMarkers(points);
        }
    }

    /**
     * 设置菱形角度标记
     */
    static setRhombusAngleMarkers(points) {
        const dot1 = document.getElementById('angle-dot1');
        const dot3 = document.getElementById('angle-dot3');
        if (dot1 && dot3) {
            dot1.setAttribute('cx', points[0].x);
            dot1.setAttribute('cy', points[0].y);
            dot1.setAttribute('r', '3');
            
            dot3.setAttribute('cx', points[2].x);
            dot3.setAttribute('cy', points[2].y);
            dot3.setAttribute('r', '3');
        }
        
        const dot2 = document.getElementById('angle-dot2');
        const dot4 = document.getElementById('angle-dot4');
        if (dot2 && dot4) {
            dot2.setAttribute('cx', points[1].x);
            dot2.setAttribute('cy', points[1].y);
            dot2.setAttribute('r', '5');
            
            dot4.setAttribute('cx', points[3].x);
            dot4.setAttribute('cy', points[3].y);
            dot4.setAttribute('r', '5');
        }
    }

    /**
     * 设置平行四边形角度标记
     */
    static setParallelogramAngleMarkers(points) {
        for (let i = 0; i < 4; i++) {
            const angleDot = document.getElementById(`angle-dot${i + 1}`);
            if (angleDot) {
                const corner = points[i];
                angleDot.setAttribute('cx', corner.x);
                angleDot.setAttribute('cy', corner.y);
                
                if (i === 0 || i === 2) {
                    angleDot.setAttribute('r', '3');
                } else {
                    angleDot.setAttribute('r', '5');
                }
            }
        }
    }

    /**
     * 设置相等边标记
     */
    static setEqualMarkers(shapeName, points) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
        if (!shape.visualElements.equal?.show) return;

        const equalMarks = document.getElementById('equal-marks');
        equalMarks.style.display = 'block';
        
        if (shapeName === 'trapezoid') {
            this.setTrapezoidEqualMarkers(points);
        } else if (shapeName === 'rectangle' || shapeName === 'parallelogram') {
            this.setOppositeEqualMarkers(points);
        } else {
            this.setAllEqualMarkers(points);
        }
    }

    /**
     * 设置梯形相等边标记
     */
    static setTrapezoidEqualMarkers(points) {
        // 实现梯形的特殊边标记逻辑
        // 这里需要根据具体需求实现
    }

    /**
     * 设置对边相等标记
     */
    static setOppositeEqualMarkers(points) {
        // 实现对边相等的标记逻辑
        // 这里需要根据具体需求实现
    }

    /**
     * 设置四边都相等标记
     */
    static setAllEqualMarkers(points) {
        // 实现四边都相等的标记逻辑
        // 这里需要根据具体需求实现
    }

    /**
     * 设置对角线标记
     */
    static setDiagonalMarkers(shapeName, points) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
        if (!shape.visualElements.diagonal?.show) return;

        const diagonalMarks = document.getElementById('diagonal-marks');
        diagonalMarks.style.display = 'block';
        
        const diagonal1 = document.getElementById('diagonal1');
        const diagonal2 = document.getElementById('diagonal2');
        if (diagonal1 && diagonal2) {
            diagonal1.setAttribute('x1', points[0].x);
            diagonal1.setAttribute('y1', points[0].y);
            diagonal1.setAttribute('x2', points[2].x);
            diagonal1.setAttribute('y2', points[2].y);
            
            diagonal2.setAttribute('x1', points[1].x);
            diagonal2.setAttribute('y1', points[1].y);
            diagonal2.setAttribute('x2', points[3].x);
            diagonal2.setAttribute('y2', points[3].y);
        }
    }

    /**
     * 高亮指定的视觉元素
     */
    static highlightVisualElement(visualType) {
        document.querySelectorAll('.visual-element').forEach(el => {
            el.classList.remove('highlight');
        });

        let targetElement = null;
        switch(visualType) {
            case 'parallel':
                targetElement = document.getElementById('parallel-marks');
                break;
            case 'equal':
                targetElement = document.getElementById('equal-marks');
                break;
            case 'equal-sides':
                targetElement = document.getElementById('sides-marks');
                break;
            case 'right-angle':
                targetElement = document.getElementById('angle-marks');
                break;
            case 'general-angle':
                targetElement = document.getElementById('angle-marks-general');
                break;
            case 'diagonal':
                targetElement = document.getElementById('diagonal-marks');
                break;
        }
        
        if (targetElement) {
            targetElement.style.display = 'block';
            targetElement.classList.add('highlight');
        }
    }

    /**
     * 清除视觉高亮
     */
    static clearVisualHighlights() {
        document.querySelectorAll('.visual-element').forEach(el => {
            el.classList.remove('highlight');
        });
    }

    /**
     * 动画变换函数
     */
    static animateTransformation(sourceShape, targetShape) {
        if (window.AppState.isAnimating) return;
        
        window.AppState.isAnimating = true;
        window.AppState.animationState.isActive = true;
        
        const polygon = document.getElementById('main-shape');
        const progressBar = document.querySelector('.progress-bar');
        const animationControls = document.querySelector('.animation-controls');
        const progressContainer = document.querySelector('.transformation-progress');
        
        // 隐藏控制按钮，显示进度条
        animationControls.style.display = 'none';
        progressContainer.style.display = 'block';
        
        // 执行动画逻辑
        this.performTransformationAnimation(sourceShape, targetShape, polygon, progressBar);
    }

    /**
     * 执行变换动画
     */
    static performTransformationAnimation(sourceShape, targetShape, polygon, progressBar) {
        const sourcePoints = window.AppData.SHAPES_DATA[sourceShape].points.split(' ').map(p => {
            const [x, y] = p.split(',').map(Number);
            return { x, y };
        });
        
        const targetPoints = window.AppData.SHAPES_DATA[targetShape].points.split(' ').map(p => {
            const [x, y] = p.split(',').map(Number);
            return { x, y };
        });
        
        // 设置起始形状
        polygon.setAttribute('points', window.AppData.SHAPES_DATA[sourceShape].points);
        this.updateVisualMarkers(sourceShape);
        
        // 动画参数
        const duration = window.AppData.CONFIG.ANIMATION_DURATION;
        const steps = 60;
        const stepDuration = duration / steps;
        let currentStep = 0;
        
        polygon.classList.add('transforming');
        
        const animationInterval = setInterval(() => {
            const progress = currentStep / steps;
            
            // 更新进度条
            progressBar.style.width = `${progress * 100}%`;
            
            // 计算当前帧的点坐标
            const currentPoints = sourcePoints.map((point, index) => {
                const targetPoint = targetPoints[index];
                const x = point.x + (targetPoint.x - point.x) * progress;
                const y = point.y + (targetPoint.y - point.y) * progress;
                return `${x},${y}`;
            }).join(' ');
            
            polygon.setAttribute('points', currentPoints);
            
            // 更新视觉标记
            if (progress < 0.3) {
                this.updateVisualMarkers(sourceShape);
            } else if (progress > 0.7) {
                this.updateVisualMarkers(targetShape);
            } else {
                this.updateVisualMarkers(sourceShape);
            }
            
            currentStep++;
            
            if (currentStep > steps) {
                this.finishTransformationAnimation(
                    animationInterval, 
                    polygon, 
                    targetShape, 
                    sourceShape
                );
            }
        }, stepDuration);
    }

    /**
     * 完成变换动画
     */
    static finishTransformationAnimation(interval, polygon, targetShape, sourceShape) {
        clearInterval(interval);
        
        // 动画完成
        polygon.setAttribute('points', window.AppData.SHAPES_DATA[targetShape].points);
        polygon.classList.remove('transforming');
        polygon.classList.add('animating');
        
        this.updateVisualMarkers(targetShape);
        this.displayShape(targetShape);
        window.App.updateActiveShape(targetShape);
        
        // 短暂显示目标形状后回到源图形
        setTimeout(() => {
            polygon.setAttribute('points', window.AppData.SHAPES_DATA[sourceShape].points);
            this.updateVisualMarkers(sourceShape);
            this.displayShape(sourceShape);
            window.App.updateActiveShape(sourceShape);
            
            this.showAnimationControls(sourceShape, targetShape);
            
            setTimeout(() => {
                polygon.classList.remove('animating');
                window.AppState.isAnimating = false;
                window.AppState.animationState.isActive = false;
            }, 300);
        }, 800);
    }

    /**
     * 显示动画控制按钮
     */
    static showAnimationControls(sourceShape, targetShape) {
        const progressContainer = document.querySelector('.transformation-progress');
        const progressBar = document.querySelector('.progress-bar');
        const animationControls = document.querySelector('.animation-controls');
        const animateBtn = document.getElementById('animate-transformation-btn');
        const comparisonBtn = document.getElementById('comparison-btn');
        
        setTimeout(() => {
            progressContainer.style.display = 'none';
            progressBar.style.width = '0%';
            
            animateBtn.textContent = '🔄 再次播放';
            animateBtn.onclick = () => {
                this.animateTransformation(sourceShape, targetShape);
            };
            
            comparisonBtn.textContent = '📊 顯示特性對比';
            comparisonBtn.onclick = () => {
                window.RelationshipModule.toggleComparison(sourceShape, targetShape);
            };
            
            animationControls.style.display = 'flex';
        }, 300);
    }

    /**
     * 更新变换区域显示
     */
    static updateTransformationArea(currentShapeName) {
        const networkContainer = document.querySelector('.network-container');
        const relationshipInfo = document.querySelector('.relationship-info');
        const relationshipText = document.getElementById('relationship-text');
        
        // 重置状态
        this.resetTransformationState();
        
        // 清空现有节点
        networkContainer.innerHTML = '';
        
        // 获取所有形状，排除当前形状
        const allShapes = ['trapezoid', 'parallelogram', 'rectangle', 'rhombus', 'square'];
        const availableShapes = allShapes.filter(shape => shape !== currentShapeName);
        
        this.createShapeNodes(availableShapes, networkContainer, currentShapeName);
        
        // 更新提示信息
        relationshipInfo.classList.remove('hidden', 'transformation');
        relationshipText.innerHTML = `點擊下方任一形狀查看變換方式及比較特性`;
    }

    /**
     * 创建形状节点
     */
    static createShapeNodes(availableShapes, container, currentShapeName) {
        availableShapes.forEach((shapeName, index) => {
            setTimeout(() => {
                const shapeNode = this.createShapeNode(shapeName, currentShapeName);
                container.appendChild(shapeNode);
                
                // 触发动画
                setTimeout(() => {
                    this.animateShapeNode(shapeNode, shapeName);
                }, 50);
                
            }, index * 150);
        });
    }

    /**
     * 创建单个形状节点
     */
    static createShapeNode(shapeName, currentShapeName) {
        const shapeNode = document.createElement('div');
        shapeNode.className = `shape-node ${shapeName}`;
        shapeNode.dataset.shape = shapeName;
        
        // 设置节点内容
        this.setShapeNodeContent(shapeNode, shapeName);
        
        // 添加点击事件
        shapeNode.addEventListener('click', (e) => {
            e.stopPropagation();
            window.RelationshipModule.handleShapeTransformation(currentShapeName, shapeName);
        });
        
        // 设置初始样式
        this.setShapeNodeInitialStyle(shapeNode, shapeName);
        
        return shapeNode;
    }

    /**
     * 设置形状节点内容
     */
    static setShapeNodeContent(node, shapeName) {
        const shapeNames = {
            'trapezoid': '梯形',
            'parallelogram': '<span>平行四邊形</span>',
            'rectangle': '長方形',
            'rhombus': '<span>菱形</span>',
            'square': '正方形'
        };
        
        node.innerHTML = shapeNames[shapeName] || shapeName;
    }

    /**
     * 设置形状节点初始样式
     */
    static setShapeNodeInitialStyle(node, shapeName) {
        node.style.opacity = '0';
        node.style.transition = 'all 0.3s ease';
        
        if (shapeName === 'parallelogram') {
            node.style.transform = 'skewX(-20deg) scale(0.8)';
        } else if (shapeName === 'rhombus') {
            node.style.transform = 'rotate(45deg) scale(0.8)';
        } else {
            node.style.transform = 'scale(0.8)';
        }
    }

    /**
     * 动画形状节点
     */
    static animateShapeNode(node, shapeName) {
        node.style.opacity = '1';
        
        if (shapeName === 'parallelogram') {
            node.style.transform = 'skewX(-20deg) scale(1)';
        } else if (shapeName === 'rhombus') {
            node.style.transform = 'rotate(45deg) scale(1)';
        } else {
            node.style.transform = 'scale(1)';
        }
    }

    /**
     * 重置变换状态
     */
    static resetTransformationState() {
        const relationshipInfo = document.querySelector('.relationship-info');
        const animationControls = document.querySelector('.animation-controls');
        const progressContainer = document.querySelector('.transformation-progress');
        
        // 清除所有激活状态
        document.querySelectorAll('.shape-node').forEach(node => {
            node.classList.remove('active');
            node.style.backgroundColor = '';
        });
        
        // 隐藏控制按钮和进度条
        animationControls.style.display = 'none';
        progressContainer.style.display = 'none';
        
        window.AppState.isComparisonMode = false;
    }
}

// 挂载到全局对象
window.ShapeModule = ShapeModule;