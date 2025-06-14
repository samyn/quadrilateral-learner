// relationships.js - 关系图和特性比较功能
// =====================================================

// 关系模块 - Class 版本

if (window.RelationshipModule) {
    console.warn('RelationshipModule already loaded, skipping...');
} else {
    // 原有代码...

class RelationshipModule {
    /**
     * 初始化模块
     */
    static init() {
        console.log('RelationshipModule class initializing...');
        // 初始化时隐藏关系图
        const relationshipSvg = document.getElementById('relationship-svg');
        if (relationshipSvg) {
            relationshipSvg.style.display = 'none';
        }
        console.log('RelationshipModule class initialized');
    }

    /**
     * 显示关系图
     */
    static showRelationshipDiagram() {
        console.log('Showing relationship diagram');
        window.AppState.isRelationshipDiagramMode = true;
        
        // 隐藏形状显示SVG和属性面板
        const shapeSvg = document.getElementById('shape-svg');
        const relationshipSvg = document.getElementById('relationship-svg');
        const propertiesPanel = document.querySelector('.properties-panel');
        const relationshipNetwork = document.querySelector('.relationship-network');
        const contentTabs = document.querySelector('.content-tabs');
        
        if (shapeSvg) shapeSvg.style.display = 'none';
        if (relationshipSvg) relationshipSvg.style.display = 'block';
        if (propertiesPanel) propertiesPanel.style.display = 'none';
        if (relationshipNetwork) relationshipNetwork.style.display = 'none';
        if (contentTabs) contentTabs.style.display = 'none';
        
        // 更新按钮状态
        document.querySelectorAll('.shape-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const diagramBtn = document.getElementById('relationship-diagram-btn');
        if (diagramBtn) {
            diagramBtn.classList.add('active');
            diagramBtn.textContent = '🔙 返回形狀學習';
        }
        
        // 重置其他状态
        if (window.ShapeModule && typeof window.ShapeModule.resetTransformationState === 'function') {
            window.ShapeModule.resetTransformationState();
        }
    }

    /**
     * 隐藏关系图，切换回形状显示
     */
    static hideRelationshipDiagram() {
        console.log('Hiding relationship diagram');
        window.AppState.isRelationshipDiagramMode = false;
        
        // 显示形状显示SVG和属性面板
        const shapeSvg = document.getElementById('shape-svg');
        const relationshipSvg = document.getElementById('relationship-svg');
        const propertiesPanel = document.querySelector('.properties-panel');
        const relationshipNetwork = document.querySelector('.relationship-network');
        const contentTabs = document.querySelector('.content-tabs');
        
        if (shapeSvg) shapeSvg.style.display = 'block';
        if (relationshipSvg) relationshipSvg.style.display = 'none';
        if (propertiesPanel) propertiesPanel.style.display = 'block';
        if (relationshipNetwork) relationshipNetwork.style.display = 'block';
        if (contentTabs) contentTabs.style.display = 'block';
        
        // 恢复按钮状态
        const diagramBtn = document.getElementById('relationship-diagram-btn');
        if (diagramBtn) {
            diagramBtn.classList.remove('active');
            diagramBtn.textContent = '圖形關係圖';
        }
    }

    /**
     * 处理形状变换
     */
    static handleShapeTransformation(sourceShape, targetShape) {
        if (!window.AppData || !window.AppData.SHAPES_DATA) {
            console.error('AppData not available');
            return;
        }

        const description = this.getTransformationDescription(sourceShape, targetShape);
        const relationshipInfo = document.querySelector('.relationship-info');
        const relationshipText = document.getElementById('relationship-text');
        const animationControls = document.querySelector('.animation-controls');
        
        // 如果当前处于对比模式，先切换回形状详情
        if (window.AppState.isComparisonMode) {
            if (window.ShapeModule && typeof window.ShapeModule.displayShape === 'function') {
                window.ShapeModule.displayShape(targetShape);
            }
            window.AppState.isComparisonMode = false;
        }
        
        // 保存变换状态
        window.AppState.animationState.sourceShape = sourceShape;
        window.AppState.animationState.targetShape = targetShape;
        
        // 高亮选中的目标形状
        document.querySelectorAll('.shape-node').forEach(node => {
            node.classList.remove('active');
            node.style.backgroundColor = '';
        });
        
        const targetNode = document.querySelector(`.shape-node[data-shape="${targetShape}"]`);
        if (targetNode) {
            targetNode.classList.add('active');
            targetNode.style.backgroundColor = '#4CAF50';
        }
        
        // 更新提示信息
        if (relationshipInfo) {
            relationshipInfo.classList.remove('hidden');
            relationshipInfo.classList.add('transformation');
        }
        
        if (relationshipText) {
            const sourceTitle = window.AppData.SHAPES_DATA[sourceShape] ? window.AppData.SHAPES_DATA[sourceShape].title : sourceShape;
            const targetTitle = window.AppData.SHAPES_DATA[targetShape] ? window.AppData.SHAPES_DATA[targetShape].title : targetShape;
            
            relationshipText.innerHTML = `
                <strong>${sourceTitle} → ${targetTitle}</strong><br>
                ${description}
            `;
        }
        
        // 隐藏控制按钮，直接开始动画
        if (animationControls) {
            animationControls.style.display = 'none';
        }
        
        // 直接播放动画
        if (window.ShapeModule && typeof window.ShapeModule.animateTransformation === 'function') {
            window.ShapeModule.animateTransformation(sourceShape, targetShape);
        }
    }

    /**
     * 切换特性对比显示
     */
    static toggleComparison(sourceShape, targetShape) {
        const comparisonBtn = document.getElementById('comparison-btn');
        
        if (window.AppState.isComparisonMode) {
            // 当前是对比模式，切换回目标形状详情
            if (window.ShapeModule && typeof window.ShapeModule.displayShape === 'function') {
                window.ShapeModule.displayShape(sourceShape);
            }
            if (comparisonBtn) comparisonBtn.textContent = '📊 顯示特性對比';
            window.AppState.isComparisonMode = false;
        } else {
            // 当前是形状详情，切换到对比模式
            this.displayShapeComparison(sourceShape, targetShape);
            if (comparisonBtn) comparisonBtn.textContent = '📋 返回形狀詳情';
            window.AppState.isComparisonMode = true;
        }
    }

    /**
     * 显示形状对比
     */
    static displayShapeComparison(sourceShape, targetShape) {
        if (!window.AppData || !window.AppData.SHAPES_DATA) {
            console.error('AppData not available for comparison');
            return;
        }

        const title = document.getElementById('shape-title');
        const propertiesList = document.getElementById('properties-list');
        
        if (!title || !propertiesList) {
            console.error('Required elements not found for comparison');
            return;
        }
        
        // 更新标题显示变换关系
        const sourceTitle = window.AppData.SHAPES_DATA[sourceShape] ? window.AppData.SHAPES_DATA[sourceShape].title : sourceShape;
        const targetTitle = window.AppData.SHAPES_DATA[targetShape] ? window.AppData.SHAPES_DATA[targetShape].title : targetShape;
        
        title.innerHTML = `
            <span style="color: #FF6B6B;">${sourceTitle}</span> 
            <span style="color: #666; font-size: 0.8em;">→</span> 
            <span style="color: #4CAF50;">${targetTitle}</span>
        `;
        
        if (window.ShapeModule && typeof window.ShapeModule.clearVisualHighlights === 'function') {
            window.ShapeModule.clearVisualHighlights();
        }
        
        // 创建对比内容
        propertiesList.innerHTML = '';
        
        // 按类别组织比较
        const categories = ['sides', 'angles', 'parallel', 'diagonals'];
        
        categories.forEach((category, categoryIndex) => {
            const categoryInfo = window.AppData.PROPERTY_CATEGORIES ? window.AppData.PROPERTY_CATEGORIES[category] : null;
            if (!categoryInfo) return;
            
            const sourceProp = this.getShapePropertyInCategory(sourceShape, category);
            const targetProp = this.getShapePropertyInCategory(targetShape, category);
            
            // 如果该类别下两个形状都没有特性，则跳过
            if (!sourceProp && !targetProp) return;
            
            // 获取关系信息
            const relationshipInfo = this.getRelationshipInfo(sourceProp, targetProp, category);
            
            setTimeout(() => {
                this.createComparisonBlock(
                    category, categoryInfo, sourceProp, targetProp, 
                    relationshipInfo, categoryIndex, propertiesList
                );
            }, categoryIndex * 300);
        });
    }

    /**
     * 创建对比块
     */
    static createComparisonBlock(category, categoryInfo, sourceProp, targetProp, relationshipInfo, categoryIndex, propertiesList) {
        const comparisonResult = this.comparePropertyLevels(sourceProp, targetProp);
        
        const categoryBlock = document.createElement('div');
        categoryBlock.className = `property-comparison category-${category}`;
        categoryBlock.style.cssText = `
            margin: 15px 0;
            background: linear-gradient(135deg, #f8f9ff 0%, #e8f5e8 100%);
            border-radius: 12px;
            border-left: 4px solid ${comparisonResult.color};
            box-shadow: 0 3px 6px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
            animation: slideInCategory 0.6s ease forwards;
            animation-delay: ${categoryIndex * 0.2}s;
            overflow: hidden;
        `;
        
        // 创建比较内容
        const sourceContent = this.createPropertyContent(sourceProp, category);
        const targetContent = this.createPropertyContent(targetProp, category);
        
        categoryBlock.innerHTML = `
            <!-- 类别标题区域 -->
            <div style="padding: 12px 15px 8px 15px; border-bottom: 1px solid rgba(255,255,255,0.5);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-weight: bold; font-size: 15px; color: #333;">${categoryInfo.name}</span>
                    ${relationshipInfo ? `<span style="font-size: 12px; color: #666; font-weight: normal;">${relationshipInfo}</span>` : ''}
                </div>
            </div>
            
            <!-- 比较内容区域 -->
            <div style="display: flex; align-items: center; padding: 15px;">
                <div style="flex: 1; padding-right: 15px;">
                    ${sourceContent}
                </div>
                <div style="flex: 0 0 80px; text-align: center;">
                    <div style="background: transparent; color: ${comparisonResult.color}; border: none; border-radius: 20px; padding: 8px 12px; font-size: 16px; box-shadow: none;">
                        ${comparisonResult.icon}
                    </div>
                    <div style="font-size: 10px; color: ${comparisonResult.color}; margin-top: 4px; font-weight: bold;">
                        ${comparisonResult.description}
                    </div>
                </div>
                <div style="flex: 1; padding-left: 15px;">
                    ${targetContent}
                </div>
            </div>
        `;
        
        // 添加点击高亮功能
        this.addComparisonBlockInteraction(categoryBlock, targetProp);
        
        propertiesList.appendChild(categoryBlock);
    }

    /**
     * 创建属性内容
     */
    static createPropertyContent(prop, category) {
        if (prop) {
            const levelInfo = this.getPropertyLevelInfo(category, prop.level);
            return `
                <div style="display: flex; align-items: center;">
                    <div>
                        <div style="font-size: 13px; font-weight: bold; color: #333;">${prop.text}</div>
                        <div style="font-size: 11px; color: #666; margin-top: 2px;">
                            ${levelInfo ? levelInfo.description : ''}
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="color: #999; font-size: 13px; text-align: center;">
                    <div>❌ 無此特性</div>
                </div>
            `;
        }
    }

    /**
     * 添加对比块交互
     */
    static addComparisonBlockInteraction(categoryBlock, targetProp) {
        categoryBlock.addEventListener('click', () => {
            document.querySelectorAll('.property-comparison').forEach(block => {
                block.style.boxShadow = '0 3px 6px rgba(0,0,0,0.08)';
                block.style.transform = 'scale(1)';
            });
            
            categoryBlock.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            categoryBlock.style.transform = 'scale(1.02)';
            
            // 高亮对应的视觉元素
            if (targetProp && targetProp.visual && window.ShapeModule && typeof window.ShapeModule.highlightVisualElement === 'function') {
                window.ShapeModule.highlightVisualElement(targetProp.visual);
            }
        });
    }

    /**
     * 获取形状在特定类别中的特性
     */
    static getShapePropertyInCategory(shapeName, category) {
        if (!window.AppData || !window.AppData.SHAPES_DATA) return null;
        
        const shape = window.AppData.SHAPES_DATA[shapeName];
        if (!shape) return null;
        
        return shape.properties.find(prop => prop.category === category) || null;
    }

    /**
     * 获取特性的层次级别描述
     */
    static getPropertyLevelInfo(category, level) {
        if (!window.AppData || !window.AppData.PROPERTY_CATEGORIES) return null;
        
        const categoryInfo = window.AppData.PROPERTY_CATEGORIES[category];
        if (!categoryInfo) return null;
        
        return categoryInfo.hierarchy.find(h => h.level === level) || null;
    }

    /**
     * 比较两个特性的层次关系
     */
    static comparePropertyLevels(sourceProp, targetProp) {
        if (!sourceProp && !targetProp) {
            return { type: 'same', icon: '➖', color: '#999', description: '均無此特性' };
        }
        
        if (!sourceProp && targetProp) {
            return { type: 'gain', icon: '➕', color: '#4CAF50', description: '獲得新特性' };
        }
        
        if (sourceProp && !targetProp) {
            return { type: 'lose', icon: '➖', color: '#FF6B6B', description: '失去特性' };
        }
        
        if (sourceProp.level === targetProp.level) {
            if (sourceProp.text === targetProp.text) {
                return { type: 'same', icon: '✓', color: '#666', description: '保持不變' };
            } else {
                return { type: 'change', icon: '🔄', color: '#FF9800', description: '同級變化' };
            }
        }
        
        // 定义层次优先级
        const levelPriority = { 'highest': 4, 'medium': 3, 'basic': 2, 'partial': 1, 'low': 0, 'none': -1 };
        const sourceLevel = levelPriority[sourceProp.level] || 0;
        const targetLevel = levelPriority[targetProp.level] || 0;
        
        if (targetLevel > sourceLevel) {
            return { type: 'upgrade', icon: '⬆️', color: '#4CAF50', description: '特性提升' };
        } else {
            return { type: 'downgrade', icon: '⬇️', color: '#FF6B6B', description: '特性降級' };
        }
    }

    /**
     * 获取层次关系说明文本
     */
    static getRelationshipInfo(sourceProp, targetProp, category) {
        if (!sourceProp || !targetProp || sourceProp.level === targetProp.level) {
            return '';
        }
        
        if (category === 'sides') {
            if (sourceProp.level === 'medium' && targetProp.level === 'highest') {
                return '💡 "四條邊都相等" 包含了 "對邊相等"';
            } else if (sourceProp.level === 'highest' && targetProp.level === 'medium') {
                return '⚠️ 從完全規則退化為部分規則';
            }
        } else if (category === 'parallel') {
            if (sourceProp.level === 'partial' && targetProp.level === 'basic') {
                return '💡 從一組平行提升為兩組平行';
            } else if (sourceProp.level === 'basic' && targetProp.level === 'partial') {
                return '⚠️ 從兩組平行退化為一組平行';
            }
        } else if (category === 'angles') {
            if (sourceProp.level === 'medium' && targetProp.level === 'highest') {
                return '💡 從對角相等提升為四個直角';
            } else if (sourceProp.level === 'highest' && targetProp.level === 'medium') {
                return '⚠️ 從四個直角退化為對角相等';
            }
        } else if (category === 'diagonals') {
            if (sourceProp.level === 'low' && targetProp.level === 'medium') {
                return '💡 對角線特性得到增強';
            } else if (sourceProp.level === 'medium' && targetProp.level === 'highest') {
                return '💡 對角線達到最完美狀態';
            } else if (sourceProp.level === 'highest' && targetProp.level === 'medium') {
                return '⚠️ 對角線特性有所減弱';
            }
        }
        
        return '';
    }

    /**
     * 获取变换描述
     */
    static getTransformationDescription(sourceShape, targetShape) {
        if (!window.AppData || !window.AppData.TRANSFORMATION_PATHS) {
            return '無法獲取變換描述';
        }
        
        const transformKey = `${sourceShape}-${targetShape}`;
        return window.AppData.TRANSFORMATION_PATHS[transformKey] || '無法直接變換，請選擇其他路徑';
    }
}

// 挂载到全局对象
console.log('Mounting RelationshipModule class to window...');
window.RelationshipModule = RelationshipModule;
console.log('RelationshipModule mounted:', window.RelationshipModule);
console.log('RelationshipModule.init type:', typeof window.RelationshipModule.init);
}