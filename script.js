// 四边形数据定义
const shapes = {
    square: {
        points: "75,75 175,75 175,175 75,175",
        title: "正方形",
        properties: [
            { text: "四條邊都相等", icon: "equal", visual: "equal", category: "sides", level: "highest" },
            { text: "四個角都是直角", icon: "right-angle", visual: "right-angle", category: "angles", level: "highest" },
            { text: "對邊平行", icon: "parallel", visual: "parallel", category: "parallel", level: "basic" },
            { text: "對角線相等且垂直", icon: "diagonal", visual: "diagonal", category: "diagonals", level: "highest" }
        ],
        visualElements: {
            parallel: { show: true },
            equal: { show: true },
            rightAngle: { show: true },
            diagonal: { show: true }
        }
    },
    rectangle: {
        points: "50,75 200,75 200,175 50,175",
        title: "長方形",
        properties: [
            { text: "對邊相等", icon: "equal", visual: "equal", category: "sides", level: "medium" },
            { text: "四個角都是直角", icon: "right-angle", visual: "right-angle", category: "angles", level: "highest" },
            { text: "對邊平行", icon: "parallel", visual: "parallel", category: "parallel", level: "basic" },
            { text: "對角線相等", icon: "diagonal", visual: "diagonal", category: "diagonals", level: "medium" }
        ],
        visualElements: {
            parallel: { show: true },
            equal: { show: true },
            rightAngle: { show: true },
            diagonal: { show: true }
        }
    },
    rhombus: {
        points: "125,70 190,125 125,180 60,125",
        title: "菱形",
        properties: [
            { text: "四條邊都相等", icon: "equal", visual: "equal", category: "sides", level: "highest" },
            { text: "對角相等", icon: "right-angle", visual: "general-angle", category: "angles", level: "medium" },
            { text: "對邊平行", icon: "parallel", visual: "parallel", category: "parallel", level: "basic" },
            { text: "對角線垂直且互相平分", icon: "diagonal", visual: "diagonal", category: "diagonals", level: "medium" }
        ],
        visualElements: {
            parallel: { show: true },
            equal: { show: true },
            rightAngle: { show: false },
            generalAngle: { show: true },
            diagonal: { show: true }
        }
    },
    parallelogram: {
        points: "75,75 175,75 200,175 100,175",
        title: "平行四邊形",
        properties: [
            { text: "對邊相等", icon: "equal", visual: "equal", category: "sides", level: "medium" },
            { text: "對角相等", icon: "right-angle", visual: "general-angle", category: "angles", level: "medium" },
            { text: "對邊平行", icon: "parallel", visual: "parallel", category: "parallel", level: "basic" },
            { text: "對角線互相平分", icon: "diagonal", visual: "diagonal", category: "diagonals", level: "low" }
        ],
        visualElements: {
            parallel: { show: true },
            equal: { show: true },
            rightAngle: { show: false },
            generalAngle: { show: true },
            diagonal: { show: true }
        }
    },
    trapezoid: {
        points: "75,75 175,75 150,175 100,175",
        title: "梯形",
        properties: [
            { text: "有一組對邊平行", icon: "parallel", visual: "parallel", category: "parallel", level: "partial" },
            { text: "上底和下底長度不等", icon: "equal", visual: "equal", category: "sides", level: "low" },
            { text: "兩腰可能不等", icon: "equal", visual: "equal-sides", category: "sides", level: "low" }
        ],
        visualElements: {
            parallel: { show: true, onlyOne: true },
            equal: { show: true },
            sides: { show: true },
            rightAngle: { show: false },
            diagonal: { show: false }
        }
    }
};

// 特性分类和层次定义
const propertyCategories = {
    sides: {
        name: "邊長特性",
        icon: "📏",
        hierarchy: [
            { level: "highest", text: "四條邊都相等", description: "完全規則" },
            { level: "medium", text: "對邊相等", description: "部分規則" },
            { level: "low", text: "邊長不等", description: "不規則" },
            { level: "partial", text: "部分邊相等", description: "特殊情況" }
        ]
    },
    angles: {
        name: "角度特性", 
        icon: "📐",
        hierarchy: [
            { level: "highest", text: "四個角都是直角", description: "完全垂直" },
            { level: "medium", text: "對角相等", description: "部分規則" },
            { level: "low", text: "角度不等", description: "不規則" }
        ]
    },
    parallel: {
        name: "平行特性",
        icon: "📄", 
        hierarchy: [
            { level: "basic", text: "對邊平行", description: "兩組平行" },
            { level: "partial", text: "有一組對邊平行", description: "一組平行" },
            { level: "none", text: "無平行邊", description: "無規則" }
        ]
    },
    diagonals: {
        name: "對角線特性",
        icon: "📐",
        hierarchy: [
            { level: "highest", text: "對角線相等且垂直", description: "完全特殊" },
            { level: "medium", text: "對角線相等或垂直", description: "部分特殊" },
            { level: "low", text: "對角線互相平分", description: "基本特性" }
        ]
    }
};

// 全局变量
let currentShape = 'square';
let isAnimating = false;

// 动画相关变量
let animationState = {
    sourceShape: null,
    targetShape: null,
    isActive: false
};

// 变换关系定义
const transformationPaths = {
    'trapezoid-parallelogram': '讓另一組對邊也變平行',
    'parallelogram-rectangle': '將所有角度都變為直角', 
    'parallelogram-rhombus': '將四條邊都變為相等',
    'rectangle-square': '將四條邊都變為相等',
    'rhombus-square': '將四個角都變為直角',
    'rectangle-rhombus': '改變角度，讓對角不再都是直角，同時調整邊長比例',
    'rhombus-rectangle': '將四個角都變為直角，同時調整邊長比例',
    'parallelogram-trapezoid': '讓一組對邊不再平行',
    'rectangle-parallelogram': '改變角度，不再都是直角',
    'rhombus-parallelogram': '改變邊長，不再都相等', 
    'square-rectangle': '改變邊長比例，長寬不相等',
    'square-rhombus': '改變角度，不再都是直角',
    'trapezoid-rectangle': '先讓另一組對邊變平行成為平行四邊形，再將所有角度變為直角',
    'trapezoid-rhombus': '先讓另一組對邊變平行成為平行四邊形，再將四條邊都變為相等',
    'trapezoid-square': '先變為平行四邊形，再通過長方形或菱形的路徑最終變為正方形',
    'rectangle-trapezoid': '先改變角度變為平行四邊形，再讓一組對邊不再平行',
    'rhombus-trapezoid': '先改變邊長變為平行四邊形，再讓一組對邊不再平行',
    'square-trapezoid': '先退化為長方形或菱形，再變為平行四邊形，最後讓一組對邊不再平行',
    'square-parallelogram': '改變邊長比例或角度，失去正方形的完美對稱性'
};

/**
 * 获取形状在特定类别中的特性
 * @param {string} shapeName - 形状名称
 * @param {string} category - 特性类别
 * @returns {Object|null} 特性对象
 */
function getShapePropertyInCategory(shapeName, category) {
    const shape = shapes[shapeName];
    if (!shape) return null;
    
    return shape.properties.find(prop => prop.category === category) || null;
}

/**
 * 获取特性的层次级别描述
 * @param {string} category - 特性类别
 * @param {string} level - 层次级别
 * @returns {Object} 层次描述对象
 */
function getPropertyLevelInfo(category, level) {
    const categoryInfo = propertyCategories[category];
    if (!categoryInfo) return null;
    
    return categoryInfo.hierarchy.find(h => h.level === level) || null;
}

/**
 * 比较两个特性的层次关系
 * @param {Object} sourceProp - 源特性
 * @param {Object} targetProp - 目标特性
 * @returns {Object} 比较结果
 */
function comparePropertyLevels(sourceProp, targetProp) {
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
 * @param {Object} sourceProp - 源特性
 * @param {Object} targetProp - 目标特性
 * @param {string} category - 特性类别
 * @returns {string} 关系说明文本
 */
function getRelationshipInfo(sourceProp, targetProp, category) {
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
 * 更新视觉标记
 * @param {string} shapeName - 形状名称
 */
function updateVisualMarkers(shapeName) {
    const shape = shapes[shapeName];
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
    for (let i = 1; i <= 4; i++) {
        const angleDot = document.getElementById(`angle-dot${i}`);
        if (angleDot) {
            angleDot.setAttribute('r', '0');
            angleDot.setAttribute('cx', '0');
            angleDot.setAttribute('cy', '0');
        }
    }

    // 设置平行线标记
    if (shape.visualElements.parallel.show) {
        const parallelMarks = document.getElementById('parallel-marks');
        parallelMarks.style.display = 'block';
        
        if (shapeName === 'trapezoid') {
            // 梯形只显示一组平行线
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
        } else {
            // 其他形状显示两组平行线
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
    }

    // 设置直角标记
    if (shape.visualElements.rightAngle && shape.visualElements.rightAngle.show) {
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

    // 设置一般角度标记
    if (shape.visualElements.generalAngle && shape.visualElements.generalAngle.show) {
        const angleMarksGeneral = document.getElementById('angle-marks-general');
        angleMarksGeneral.style.display = 'block';
        
        for (let i = 1; i <= 4; i++) {
            const angleDot = document.getElementById(`angle-dot${i}`);
            if (angleDot) {
                angleDot.setAttribute('r', '0');
                angleDot.setAttribute('cx', '0');
                angleDot.setAttribute('cy', '0');
            }
        }
        
        if (shapeName === 'rhombus') {
            // 菱形角度标记
            const corner0 = points[0];
            const corner1 = points[1];
            const corner2 = points[2];
            const corner3 = points[3];
            
            const dot1 = document.getElementById('angle-dot1');
            const dot3 = document.getElementById('angle-dot3');
            if (dot1 && dot3) {
                dot1.setAttribute('cx', corner0.x);
                dot1.setAttribute('cy', corner0.y);
                dot1.setAttribute('r', '3');
                
                dot3.setAttribute('cx', corner2.x);
                dot3.setAttribute('cy', corner2.y);
                dot3.setAttribute('r', '3');
            }
            
            const dot2 = document.getElementById('angle-dot2');
            const dot4 = document.getElementById('angle-dot4');
            if (dot2 && dot4) {
                dot2.setAttribute('cx', corner1.x);
                dot2.setAttribute('cy', corner1.y);
                dot2.setAttribute('r', '5');
                
                dot4.setAttribute('cx', corner3.x);
                dot4.setAttribute('cy', corner3.y);
                dot4.setAttribute('r', '5');
            }
            
        } else if (shapeName === 'parallelogram') {
            // 平行四边形角度标记
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
    } else {
        const angleMarksGeneral = document.getElementById('angle-marks-general');
        if (angleMarksGeneral) {
            angleMarksGeneral.style.display = 'none';
        }
    }

    // 设置相等边标记
    if (shape.visualElements.equal && shape.visualElements.equal.show) {
        const equalMarks = document.getElementById('equal-marks');
        equalMarks.style.display = 'block';
        
        if (shapeName === 'trapezoid') {
            // 梯形的特殊处理
            for (let i = 1; i <= 4; i++) {
                const equalA = document.getElementById(`equal${i}a`);
                const equalB = document.getElementById(`equal${i}b`);
                if (equalA && equalB) {
                    equalA.setAttribute('x1', 0);
                    equalA.setAttribute('y1', 0);
                    equalA.setAttribute('x2', 0);
                    equalA.setAttribute('y2', 0);
                    equalB.setAttribute('x1', 0);
                    equalB.setAttribute('y1', 0);
                    equalB.setAttribute('x2', 0);
                    equalB.setAttribute('y2', 0);
                }
            }
            
            // 上边标记
            const topMidX = (points[0].x + points[1].x) / 2;
            const topMidY = (points[0].y + points[1].y) / 2;
            const equal1a = document.getElementById('equal1a');
            if (equal1a) {
                equal1a.setAttribute('x1', topMidX - 5);
                equal1a.setAttribute('y1', topMidY - 3);
                equal1a.setAttribute('x2', topMidX + 5);
                equal1a.setAttribute('y2', topMidY - 3);
            }
            
            // 下边标记
            const bottomMidX = (points[2].x + points[3].x) / 2;
            const bottomMidY = (points[2].y + points[3].y) / 2;
            const equal3a = document.getElementById('equal3a');
            const equal3b = document.getElementById('equal3b');
            if (equal3a && equal3b) {
                equal3a.setAttribute('x1', bottomMidX - 5);
                equal3a.setAttribute('y1', bottomMidY + 3);
                equal3a.setAttribute('x2', bottomMidX + 5);
                equal3a.setAttribute('y2', bottomMidY + 3);
                equal3b.setAttribute('x1', bottomMidX - 5);
                equal3b.setAttribute('y1', bottomMidY + 6);
                equal3b.setAttribute('x2', bottomMidX + 5);
                equal3b.setAttribute('y2', bottomMidY + 6);
            }
            
            // 设置两腰标记
            const sidesMarks = document.getElementById('sides-marks');
            sidesMarks.style.display = 'block';
            
            const leftWaistMidX = (points[0].x + points[3].x) / 2;
            const leftWaistMidY = (points[0].y + points[3].y) / 2;
            const side1a = document.getElementById('side1a');
            if (side1a) {
                side1a.setAttribute('x1', leftWaistMidX - 3);
                side1a.setAttribute('y1', leftWaistMidY - 3);
                side1a.setAttribute('x2', leftWaistMidX - 3);
                side1a.setAttribute('y2', leftWaistMidY + 3);
            }
            
            const rightWaistMidX = (points[1].x + points[2].x) / 2;
            const rightWaistMidY = (points[1].y + points[2].y) / 2;
            const side2a = document.getElementById('side2a');
            const side2b = document.getElementById('side2b');
            if (side2a && side2b) {
                side2a.setAttribute('x1', rightWaistMidX + 3);
                side2a.setAttribute('y1', rightWaistMidY - 3);
                side2a.setAttribute('x2', rightWaistMidX + 3);
                side2a.setAttribute('y2', rightWaistMidY + 3);
                side2b.setAttribute('x1', rightWaistMidX + 6);
                side2b.setAttribute('y1', rightWaistMidY - 3);
                side2b.setAttribute('x2', rightWaistMidX + 6);
                side2b.setAttribute('y2', rightWaistMidY + 3);
            }
        } else {
            // 其他形状的相等边标记
            const sidesMarks = document.getElementById('sides-marks');
            if (sidesMarks) {
                sidesMarks.style.display = 'none';
            }
            
            for (let i = 1; i <= 4; i++) {
                const equalA = document.getElementById(`equal${i}a`);
                const equalB = document.getElementById(`equal${i}b`);
                if (equalA && equalB) {
                    equalA.setAttribute('x1', 0);
                    equalA.setAttribute('y1', 0);
                    equalA.setAttribute('x2', 0);
                    equalA.setAttribute('y2', 0);
                    equalB.setAttribute('x1', 0);
                    equalB.setAttribute('y1', 0);
                    equalB.setAttribute('x2', 0);
                    equalB.setAttribute('y2', 0);
                }
            }
            
            if (shapeName === 'rectangle' || shapeName === 'parallelogram') {
                // 对边相等标记
                const topMidX = (points[0].x + points[1].x) / 2;
                const topMidY = (points[0].y + points[1].y) / 2;
                const equal1a = document.getElementById('equal1a');
                if (equal1a) {
                    equal1a.setAttribute('x1', topMidX - 5);
                    equal1a.setAttribute('y1', topMidY - 3);
                    equal1a.setAttribute('x2', topMidX + 5);
                    equal1a.setAttribute('y2', topMidY - 3);
                }
                
                const bottomMidX = (points[2].x + points[3].x) / 2;
                const bottomMidY = (points[2].y + points[3].y) / 2;
                const equal3a = document.getElementById('equal3a');
                if (equal3a) {
                    equal3a.setAttribute('x1', bottomMidX - 5);
                    equal3a.setAttribute('y1', bottomMidY + 3);
                    equal3a.setAttribute('x2', bottomMidX + 5);
                    equal3a.setAttribute('y2', bottomMidY + 3);
                }
                
                const leftMidX = (points[0].x + points[3].x) / 2;
                const leftMidY = (points[0].y + points[3].y) / 2;
                const equal2a = document.getElementById('equal2a');
                const equal2b = document.getElementById('equal2b');
                if (equal2a && equal2b) {
                    equal2a.setAttribute('x1', leftMidX - 3);
                    equal2a.setAttribute('y1', leftMidY - 3);
                    equal2a.setAttribute('x2', leftMidX - 3);
                    equal2a.setAttribute('y2', leftMidY + 3);
                    equal2b.setAttribute('x1', leftMidX - 6);
                    equal2b.setAttribute('y1', leftMidY - 3);
                    equal2b.setAttribute('x2', leftMidX - 6);
                    equal2b.setAttribute('y2', leftMidY + 3);
                }
                
                const rightMidX = (points[1].x + points[2].x) / 2;
                const rightMidY = (points[1].y + points[2].y) / 2;
                const equal4a = document.getElementById('equal4a');
                const equal4b = document.getElementById('equal4b');
                if (equal4a && equal4b) {
                    equal4a.setAttribute('x1', rightMidX + 3);
                    equal4a.setAttribute('y1', rightMidY - 3);
                    equal4a.setAttribute('x2', rightMidX + 3);
                    equal4a.setAttribute('y2', rightMidY + 3);
                    equal4b.setAttribute('x1', rightMidX + 6);
                    equal4b.setAttribute('y1', rightMidY - 3);
                    equal4b.setAttribute('x2', rightMidX + 6);
                    equal4b.setAttribute('y2', rightMidY + 3);
                }
            } else {
                // 四边都相等的标记（正方形、菱形）
                for (let i = 0; i < 4; i++) {
                    const p1 = points[i];
                    const p2 = points[(i + 1) % 4];
                    const midX = (p1.x + p2.x) / 2;
                    const midY = (p1.y + p2.y) / 2;
                    
                    const equalA = document.getElementById(`equal${i + 1}a`);
                    const equalB = document.getElementById(`equal${i + 1}b`);
                    
                    if (equalA && equalB) {
                        if (i % 2 === 0) {
                            equalA.setAttribute('x1', midX - 3);
                            equalA.setAttribute('y1', midY - 3);
                            equalA.setAttribute('x2', midX + 3);
                            equalA.setAttribute('y2', midY - 3);
                            equalB.setAttribute('x1', midX - 3);
                            equalB.setAttribute('y1', midY + 3);
                            equalB.setAttribute('x2', midX + 3);
                            equalB.setAttribute('y2', midY + 3);
                        } else {
                            equalA.setAttribute('x1', midX - 3);
                            equalA.setAttribute('y1', midY - 3);
                            equalA.setAttribute('x2', midX - 3);
                            equalA.setAttribute('y2', midY + 3);
                            equalB.setAttribute('x1', midX + 3);
                            equalB.setAttribute('y1', midY - 3);
                            equalB.setAttribute('x2', midX + 3);
                            equalB.setAttribute('y2', midY + 3);
                        }
                    }
                }
            }
        }
    } else {
        const sidesMarks = document.getElementById('sides-marks');
        if (sidesMarks) {
            sidesMarks.style.display = 'none';
        }
    }

    // 设置对角线
    if (shape.visualElements.diagonal && shape.visualElements.diagonal.show) {
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
}

/**
 * 高亮指定的视觉元素
 * @param {string} visualType - 视觉元素类型
 */
function highlightVisualElement(visualType) {
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
function clearVisualHighlights() {
    document.querySelectorAll('.visual-element').forEach(el => {
        el.classList.remove('highlight');
    });
}

/**
 * 显示指定形状
 * @param {string} shapeName - 形状名称
 */
function displayShape(shapeName) {
    if (isAnimating) return;
    
    const shape = shapes[shapeName];
    if (!shape) return;
    
    const polygon = document.getElementById('main-shape');
    const title = document.getElementById('shape-title');
    const propertiesList = document.getElementById('properties-list');

    polygon.classList.add('morphing');
    
    setTimeout(() => {
        polygon.setAttribute('points', shape.points);
        polygon.classList.remove('morphing');
        updateVisualMarkers(shapeName);
    }, 200);

    title.textContent = shape.title;
    clearVisualHighlights();
    
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
                    highlightVisualElement(prop.visual);
                }
            });
            
            propertiesList.appendChild(propertyDiv);
        }, index * 200);
    });

    currentShape = shapeName;
    
    // 更新变换区域显示
    updateTransformationArea(shapeName);
}

/**
 * 更新变换区域显示
 * @param {string} currentShapeName - 当前形状名称
 */
function updateTransformationArea(currentShapeName) {
    const networkContainer = document.querySelector('.network-container');
    const relationshipInfo = document.querySelector('.relationship-info');
    const relationshipText = document.getElementById('relationship-text');
    const animateBtn = document.getElementById('animate-transformation-btn');
    const progressContainer = document.querySelector('.transformation-progress');
    
    // 重置状态
    resetTransformationState();
    
    // 清空现有节点
    networkContainer.innerHTML = '';
    
    // 获取所有形状，排除当前形状
    const allShapes = ['trapezoid', 'parallelogram', 'rectangle', 'rhombus', 'square'];
    const availableShapes = allShapes.filter(shape => shape !== currentShapeName);
    
    // 动态创建形状节点
    availableShapes.forEach((shapeName, index) => {
        setTimeout(() => {
            const shapeNode = document.createElement('div');
            shapeNode.className = `shape-node ${shapeName}`;
            shapeNode.dataset.shape = shapeName;
            
            // 设置节点样式和内容（确保正确应用CSS变换）
            switch(shapeName) {
                case 'trapezoid':
                    shapeNode.textContent = '梯形';
                    break;
                case 'parallelogram':
                    shapeNode.innerHTML = '<span>平行四邊形</span>';
                    break;
                case 'rectangle':
                    shapeNode.textContent = '長方形';
                    break;
                case 'rhombus':
                    shapeNode.innerHTML = '<span>菱形</span>';
                    break;
                case 'square':
                    shapeNode.textContent = '正方形';
                    break;
            }
            
            // 添加点击事件
            shapeNode.addEventListener('click', (e) => {
                e.stopPropagation();
                handleShapeTransformation(currentShapeName, shapeName);
            });
            
            // 添加动画效果（避免覆盖形状特定的变换样式）
            shapeNode.style.opacity = '0';
            shapeNode.style.transition = 'all 0.3s ease';
            
            // 为特殊形状保留原有变换，只添加缩放
            if (shapeName === 'parallelogram') {
                shapeNode.style.transform = 'skewX(-20deg) scale(0.8)';
            } else if (shapeName === 'rhombus') {
                shapeNode.style.transform = 'rotate(45deg) scale(0.8)';
            } else {
                shapeNode.style.transform = 'scale(0.8)';
            }
            
            networkContainer.appendChild(shapeNode);
            
            // 触发动画（恢复到正常状态）
            setTimeout(() => {
                shapeNode.style.opacity = '1';
                if (shapeName === 'parallelogram') {
                    shapeNode.style.transform = 'skewX(-20deg) scale(1)';
                } else if (shapeName === 'rhombus') {
                    shapeNode.style.transform = 'rotate(45deg) scale(1)';
                } else {
                    shapeNode.style.transform = 'scale(1)';
                }
            }, 50);
            
        }, index * 150);
    });
    
    // 更新提示信息
    relationshipInfo.classList.remove('hidden', 'transformation');
    relationshipText.innerHTML = `點擊下方任一形狀查看變換方式`;
}

/**
 * 处理形状变换
 * @param {string} sourceShape - 源形状
 * @param {string} targetShape - 目标形状
 */
function handleShapeTransformation(sourceShape, targetShape) {
    const description = getTransformationDescription(sourceShape, targetShape);
    const relationshipInfo = document.querySelector('.relationship-info');
    const relationshipText = document.getElementById('relationship-text');
    const animateBtn = document.getElementById('animate-transformation-btn');
    
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
    relationshipInfo.classList.remove('hidden');
    relationshipInfo.classList.add('transformation');
    relationshipText.innerHTML = `
        <strong>${shapes[sourceShape].title} → ${shapes[targetShape].title}</strong><br>
        ${description}
    `;
    
    // 显示动画按钮
    animateBtn.style.display = 'inline-block';
    animateBtn.onclick = () => {
        animateTransformation(sourceShape, targetShape);
    };
}

/**
 * 重置变换状态
 */
function resetTransformationState() {
    const relationshipInfo = document.querySelector('.relationship-info');
    const animateBtn = document.getElementById('animate-transformation-btn');
    const progressContainer = document.querySelector('.transformation-progress');
    
    // 清除所有激活状态
    document.querySelectorAll('.shape-node').forEach(node => {
        node.classList.remove('active');
        node.style.backgroundColor = '';
    });
    
    // 隐藏动画按钮和进度条
    animateBtn.style.display = 'none';
    progressContainer.style.display = 'none';
}

/**
 * 处理形状选择（简化版，主要用于顶部按钮）
 * @param {string} shapeName - 形状名称
 */
function handleShapeSelection(shapeName) {
    resetTransformationState();
    updateActiveShape(shapeName);
    displayShape(shapeName);
}

/**
 * 显示形状对比 - 改进版本，将关系信息显示在类别标题中
 * @param {string} sourceShape - 源形状
 * @param {string} targetShape - 目标形状
 */
function displayShapeComparison(sourceShape, targetShape) {
    const title = document.getElementById('shape-title');
    const propertiesList = document.getElementById('properties-list');
    
    // 更新标题显示变换关系
    title.innerHTML = `
        <span style="color: #FF6B6B;">${shapes[sourceShape].title}</span> 
        <span style="color: #666; font-size: 0.8em;">→</span> 
        <span style="color: #4CAF50;">${shapes[targetShape].title}</span>
    `;
    
    clearVisualHighlights();
    
    // 创建对比内容
    propertiesList.innerHTML = '';
    
    // 按类别组织比较
    const categories = ['sides', 'angles', 'parallel', 'diagonals'];
    
    categories.forEach((category, categoryIndex) => {
        const categoryInfo = propertyCategories[category];
        if (!categoryInfo) return;
        
        const sourceProp = getShapePropertyInCategory(sourceShape, category);
        const targetProp = getShapePropertyInCategory(targetShape, category);
        
        // 如果该类别下两个形状都没有特性，则跳过
        if (!sourceProp && !targetProp) return;
        
        // 获取关系信息
        const relationshipInfo = getRelationshipInfo(sourceProp, targetProp, category);
        
        setTimeout(() => {
            // 创建合并的类别比较块
            const comparisonResult = comparePropertyLevels(sourceProp, targetProp);
            
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
            
            // 添加动画样式
            if (!document.getElementById('category-animations')) {
                const style = document.createElement('style');
                style.id = 'category-animations';
                style.textContent = `
                    @keyframes slideInCategory {
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    @keyframes slideInComparison {
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // 创建比较内容
            const sourceContent = sourceProp ? `
                <div style="display: flex; align-items: center;">
                    <div>
                        <div style="font-size: 13px; font-weight: bold; color: #333;">${sourceProp.text}</div>
                        <div style="font-size: 11px; color: #666; margin-top: 2px;">
                            ${getPropertyLevelInfo(category, sourceProp.level)?.description || ''}
                        </div>
                    </div>
                </div>
            ` : `
                <div style="color: #999; font-size: 13px; text-align: center;">
                    <div>❌ 無此特性</div>
                </div>
            `;
            
            const targetContent = targetProp ? `
                <div style="display: flex; align-items: center;">
                    <div>
                        <div style="font-size: 13px; font-weight: bold; color: #333;">${targetProp.text}</div>
                        <div style="font-size: 11px; color: #666; margin-top: 2px;">
                            ${getPropertyLevelInfo(category, targetProp.level)?.description || ''}
                        </div>
                    </div>
                </div>
            ` : `
                <div style="color: #999; font-size: 13px; text-align: center;">
                    <div>❌ 無此特性</div>
                </div>
            `;
            
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
            categoryBlock.addEventListener('click', () => {
                document.querySelectorAll('.property-comparison').forEach(block => {
                    block.style.boxShadow = '0 3px 6px rgba(0,0,0,0.08)';
                    block.style.transform = 'scale(1)';
                });
                
                categoryBlock.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
                categoryBlock.style.transform = 'scale(1.02)';
                
                // 高亮对应的视觉元素
                if (targetProp && targetProp.visual) {
                    highlightVisualElement(targetProp.visual);
                }
            });
            
            propertiesList.appendChild(categoryBlock);
            
        }, categoryIndex * 300);
    });
    
    // 添加返回按钮
    setTimeout(() => {
        const backButton = document.createElement('button');
        backButton.textContent = '📚 返回形状详情';
        backButton.style.cssText = `
            width: 100%;
            padding: 12px;
            margin-top: 25px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
            animation: slideInComparison 0.5s ease forwards;
            animation-delay: ${categories.length * 0.3}s;
        `;
        
        backButton.addEventListener('mouseenter', () => {
            backButton.style.transform = 'translateY(-2px)';
            backButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        });
        
        backButton.addEventListener('mouseleave', () => {
            backButton.style.transform = 'translateY(0)';
            backButton.style.boxShadow = 'none';
        });
        
        backButton.addEventListener('click', () => {
            handleShapeSelection(targetShape);
        });
        
        propertiesList.appendChild(backButton);
    }, categories.length * 300);
}

/**
 * 动画变换函数
 * @param {string} sourceShape - 源形状
 * @param {string} targetShape - 目标形状
 */
function animateTransformation(sourceShape, targetShape) {
    if (isAnimating) return;
    
    isAnimating = true;
    animationState.isActive = true;
    animationState.sourceShape = sourceShape;
    animationState.targetShape = targetShape;
    
    const polygon = document.getElementById('main-shape');
    const progressBar = document.querySelector('.progress-bar');
    const animateBtn = document.getElementById('animate-transformation-btn');
    const progressContainer = document.querySelector('.transformation-progress');
    
    // 隐藏按钮，显示进度条
    animateBtn.style.display = 'none';
    progressContainer.style.display = 'block';
    
    // 获取起始和目标点
    const sourcePoints = shapes[sourceShape].points.split(' ').map(p => {
        const [x, y] = p.split(',').map(Number);
        return { x, y };
    });
    
    const targetPoints = shapes[targetShape].points.split(' ').map(p => {
        const [x, y] = p.split(',').map(Number);
        return { x, y };
    });
    
    // 设置起始形状
    polygon.setAttribute('points', shapes[sourceShape].points);
    updateVisualMarkers(sourceShape);
    
    // 动画参数
    const duration = 3000; // 3秒动画
    const steps = 60; // 60帧
    const stepDuration = duration / steps;
    let currentStep = 0;
    
    // 添加变换动画类
    polygon.classList.add('transforming');
    
    const animationInterval = setInterval(() => {
        const progress = currentStep / steps;
        
        // 更新进度条
        progressBar.style.width = `${progress * 100}%`;
        
        // 计算当前帧的点坐标（线性插值）
        const currentPoints = sourcePoints.map((point, index) => {
            const targetPoint = targetPoints[index];
            const x = point.x + (targetPoint.x - point.x) * progress;
            const y = point.y + (targetPoint.y - point.y) * progress;
            return `${x},${y}`;
        }).join(' ');
        
        polygon.setAttribute('points', currentPoints);
        
        // 更新视觉标记（在中间阶段逐渐过渡）
        if (progress < 0.3) {
            updateVisualMarkers(sourceShape);
        } else if (progress > 0.7) {
            updateVisualMarkers(targetShape);
        } else {
            updateVisualMarkers(sourceShape);
        }
        
        currentStep++;
        
        if (currentStep > steps) {
            clearInterval(animationInterval);
            
            // 动画完成
            polygon.setAttribute('points', shapes[targetShape].points);
            polygon.classList.remove('transforming');
            polygon.classList.add('animating');
            
            // 更新到目标形状
            updateVisualMarkers(targetShape);
            
            // 显示形状对比而不是单独的形状信息
            displayShapeComparison(sourceShape, targetShape);
            updateActiveShape(targetShape);
            
            // 恢复按钮状态
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressBar.style.width = '0%';
                animateBtn.style.display = 'inline-block';
                
                polygon.classList.remove('animating');
                isAnimating = false;
                animationState.isActive = false;
            }, 500);
        }
    }, stepDuration);
}

/**
 * 获取变换描述
 * @param {string} sourceShape - 源形状
 * @param {string} targetShape - 目标形状
 * @returns {string} 变换描述
 */
function getTransformationDescription(sourceShape, targetShape) {
    const transformKey = `${sourceShape}-${targetShape}`;
    return transformationPaths[transformKey] || '無法直接變換，請選擇其他路徑';
}

/**
 * 更新活动形状
 * @param {string} shapeName - 形状名称
 */
function updateActiveShape(shapeName) {
    document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`[data-shape="${shapeName}"]`);
    if (btn) btn.classList.add('active');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 形状按钮事件监听
    document.querySelectorAll('.shape-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleShapeSelection(btn.dataset.shape);
        });
    });

    // 点击空白处重置选择状态
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.shape-node') && 
            !e.target.closest('.relationship-info') &&
            !e.target.closest('.property') &&
            !e.target.closest('.property-comparison') &&
            !e.target.closest('#animate-transformation-btn') &&
            !e.target.closest('.transformation-progress')) {
            
            // 重置变换区域状态
            resetTransformationState();
            
            document.querySelectorAll('.property').forEach(p => {
                p.classList.remove('highlight');
            });
            
            document.querySelectorAll('.property-comparison').forEach(row => {
                row.style.boxShadow = '0 3px 6px rgba(0,0,0,0.08)';
                row.style.transform = 'scale(1)';
            });
            
            clearVisualHighlights();
        }
    });

    // 初始化显示
    displayShape('square');
    updateActiveShape('square');
});