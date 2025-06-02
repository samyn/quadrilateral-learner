// 四边形数据定义
const shapes = {
    square: {
        points: "75,75 175,75 175,175 75,175",
        title: "正方形",
        properties: [
            { text: "四條邊都相等", icon: "equal", visual: "equal" },
            { text: "四個角都是直角", icon: "right-angle", visual: "right-angle" },
            { text: "對邊平行", icon: "parallel", visual: "parallel" },
            { text: "對角線相等且垂直", icon: "diagonal", visual: "diagonal" }
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
            { text: "對邊相等", icon: "equal", visual: "equal" },
            { text: "四個角都是直角", icon: "right-angle", visual: "right-angle" },
            { text: "對邊平行", icon: "parallel", visual: "parallel" },
            { text: "對角線相等", icon: "diagonal", visual: "diagonal" }
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
            { text: "四條邊都相等", icon: "equal", visual: "equal" },
            { text: "對角相等", icon: "right-angle", visual: "general-angle" },
            { text: "對邊平行", icon: "parallel", visual: "parallel" },
            { text: "對角線垂直且互相平分", icon: "diagonal", visual: "diagonal" }
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
            { text: "對邊相等", icon: "equal", visual: "equal" },
            { text: "對角相等", icon: "right-angle", visual: "general-angle" },
            { text: "對邊平行", icon: "parallel", visual: "parallel" },
            { text: "對角線互相平分", icon: "diagonal", visual: "diagonal" }
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
            { text: "有一組對邊平行", icon: "parallel", visual: "parallel" },
            { text: "上底和下底長度不等", icon: "equal", visual: "equal" },
            { text: "兩腰可能不等", icon: "equal", visual: "equal-sides" }
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

// 全局变量
let currentShape = 'square';
let isAnimating = false;

// 动画相关变量
let animationState = {
    sourceShape: null,
    targetShape: null,
    isActive: false
};

// 形状交互状态
let interactionState = {
    sourceShape: null,
    isSelectingTarget: false
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
            
            // 更新形状信息
            displayShape(targetShape);
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
 * 处理形状选择
 * @param {string} shapeName - 形状名称
 */
function handleShapeSelection(shapeName) {
    const shapeNode = document.querySelector(`.shape-node[data-shape="${shapeName}"]`);
    
    if (!interactionState.isSelectingTarget) {
        resetShapeSelection();
        interactionState.sourceShape = shapeName;
        interactionState.isSelectingTarget = true;
        
        shapeNode.classList.add('active');
        shapeNode.style.backgroundColor = '#4CAF50';
        
        const relationshipInfo = document.querySelector('.relationship-info');
        const relationshipText = document.getElementById('relationship-text');
        const animateBtn = document.getElementById('animate-transformation-btn');
        
        relationshipInfo.classList.remove('hidden');
        relationshipInfo.classList.remove('transformation');
        relationshipText.textContent = `✨ 已選擇 ${shapes[shapeName].title}，請點擊目標形狀查看變換方式`;
        animateBtn.style.display = 'none';
        
    } else if (shapeName === interactionState.sourceShape) {
        resetShapeSelection();
        
    } else {
        const sourceShape = interactionState.sourceShape;
        const targetShape = shapeName;
        
        shapeNode.classList.add('active');
        shapeNode.style.backgroundColor = '#FF6B6B';
        
        const description = getTransformationDescription(sourceShape, targetShape);
        const relationshipInfo = document.querySelector('.relationship-info');
        const relationshipText = document.getElementById('relationship-text');
        const animateBtn = document.getElementById('animate-transformation-btn');
        
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
        
        interactionState.isSelectingTarget = false;
        interactionState.sourceShape = null;
    }
}

/**
 * 重置形状选择状态
 */
function resetShapeSelection() {
    interactionState.sourceShape = null;
    interactionState.isSelectingTarget = false;
    
    document.querySelectorAll('.shape-node').forEach(node => {
        node.classList.remove('active');
        node.style.backgroundColor = '';
    });
    
    const relationshipInfo = document.querySelector('.relationship-info');
    const relationshipText = document.getElementById('relationship-text');
    const animateBtn = document.getElementById('animate-transformation-btn');
    const progressContainer = document.querySelector('.transformation-progress');
    
    relationshipInfo.classList.add('hidden');
    relationshipInfo.classList.remove('transformation');
    relationshipText.textContent = '💡 點擊一個形狀作為起點，再點擊另一個形狀查看變換方式';
    animateBtn.style.display = 'none';
    progressContainer.style.display = 'none';
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
            updateActiveShape(btn.dataset.shape);
            displayShape(btn.dataset.shape);
        });
    });

    // 形状节点事件监听
    document.querySelectorAll('.shape-node').forEach(node => {
        node.addEventListener('click', (e) => {
            e.stopPropagation();
            
            handleShapeSelection(node.dataset.shape);
            updateActiveShape(node.dataset.shape);
            displayShape(node.dataset.shape);
        });
    });

    // 点击空白处重置选择状态
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.shape-node') && 
            !e.target.closest('.relationship-info') &&
            !e.target.closest('.property') &&
            !e.target.closest('#animate-transformation-btn') &&
            !e.target.closest('.transformation-progress')) {
            
            if (interactionState.isSelectingTarget) {
                resetShapeSelection();
            }
            
            document.querySelectorAll('.property').forEach(p => {
                p.classList.remove('highlight');
            });
            clearVisualHighlights();
        }
    });

    // 初始化显示
    displayShape('square');
    updateActiveShape('square');
    resetShapeSelection();
});