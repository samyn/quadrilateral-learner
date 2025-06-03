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
let isComparisonMode = false;
let isRelationshipDiagramMode = false;
let isChallengeMode = false;

// 动画相关变量
let animationState = {
    sourceShape: null,
    targetShape: null,
    isActive: false
};

// 挑战模式相关变量
let challengeState = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    wrongQuestions: [],
    totalQuestions: 10, // 每次挑战固定10道题
    isAnswered: false
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

// 题目数据库
let questionBank = [];
let practicesData = null;

// 获取题目总数的辅助函数
function getTotalQuestionCount() {
    return questionBank.length;
}

// Cookie 管理函数
const CookieManager = {
    /**
     * 设置Cookie
     */
    set(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    },

    /**
     * 获取Cookie
     */
    get(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                try {
                    return JSON.parse(c.substring(nameEQ.length, c.length));
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    },

    /**
     * 删除Cookie
     */
    remove(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
};

// 答题记录管理
const ProgressManager = {
    COOKIE_NAME: 'quadrilateral_progress',

    /**
     * 获取学习进度
     */
    getProgress() {
        const progress = CookieManager.get(this.COOKIE_NAME);
        if (!progress) {
            return {
                answeredQuestions: [], // 已答过的题目ID
                correctQuestions: [],  // 答对的题目ID
                wrongQuestions: [],    // 答错的题目ID（会重复出现直到答对）
                challengeCount: 0,     // 挑战次数
                totalCorrect: 0,       // 总答对数
                totalWrong: 0,         // 总答错数
                lastChallengeDate: null
            };
        }
        return progress;
    },

    /**
     * 保存学习进度
     */
    saveProgress(progress) {
        CookieManager.set(this.COOKIE_NAME, progress);
    },

    /**
     * 记录答题结果
     */
    recordAnswer(questionId, isCorrect) {
        const progress = this.getProgress();
        
        // 记录已答过的题目
        if (!progress.answeredQuestions.includes(questionId)) {
            progress.answeredQuestions.push(questionId);
        }

        if (isCorrect) {
            // 答对了
            if (!progress.correctQuestions.includes(questionId)) {
                progress.correctQuestions.push(questionId);
                progress.totalCorrect++;
            }
            // 如果之前答错过，现在答对了，从错题列表中移除
            const wrongIndex = progress.wrongQuestions.indexOf(questionId);
            if (wrongIndex > -1) {
                progress.wrongQuestions.splice(wrongIndex, 1);
            }
        } else {
            // 答错了
            if (!progress.wrongQuestions.includes(questionId)) {
                progress.wrongQuestions.push(questionId);
                progress.totalWrong++;
            }
        }

        this.saveProgress(progress);
        return progress;
    },

    /**
     * 开始新的挑战
     */
    startChallenge() {
        const progress = this.getProgress();
        progress.challengeCount++;
        progress.lastChallengeDate = new Date().toISOString();
        this.saveProgress(progress);
        return progress;
    },

    /**
     * 检查是否完成所有挑战 - 修正：使用动态题目总数
     */
    isAllCompleted() {
        const progress = this.getProgress();
        const totalQuestions = getTotalQuestionCount();
        // 所有题目都答对且错题列表为空
        return progress.correctQuestions.length === totalQuestions && progress.wrongQuestions.length === 0;
    },

    /**
     * 重置进度
     */
    resetProgress() {
        CookieManager.remove(this.COOKIE_NAME);
    }
};

// 智能出题算法 - 修改版：嚴格限制每次10道題
const QuestionSelector = {
    /**
     * 选择本次挑战的题目 - 修改為嚴格限制10道題
     */
    selectQuestionsForChallenge() {
        const progress = ProgressManager.getProgress();
        const allQuestions = [...questionBank];
        const questionsPerChallenge = 10; // 嚴格限制每次10道題

        // 如果已经完成所有题目，顯示完成信息而不是出題
        if (ProgressManager.isAllCompleted()) {
            console.log('恭喜！已完成所有挑戰！');
            return []; // 返回空數組，觸發完成流程
        }

        // 获取不同类型的题目
        const unansweredQuestions = allQuestions.filter(q => !progress.answeredQuestions.includes(q.id));
        const wrongQuestions = allQuestions.filter(q => progress.wrongQuestions.includes(q.id));
        const correctQuestions = allQuestions.filter(q => progress.correctQuestions.includes(q.id));

        console.log('题目分布:', {
            total: allQuestions.length,
            unanswered: unansweredQuestions.length,
            wrong: wrongQuestions.length,
            correct: correctQuestions.length
        });

        let selectedQuestions = [];

        // 優先級1: 錯題（但最多只取10道）
        if (wrongQuestions.length > 0) {
            const shuffledWrong = [...wrongQuestions].sort(() => Math.random() - 0.5);
            const wrongToAdd = Math.min(questionsPerChallenge, shuffledWrong.length);
            selectedQuestions = selectedQuestions.concat(shuffledWrong.slice(0, wrongToAdd));
            console.log('添加错题:', wrongToAdd);
        }

        // 優先級2: 未答過的題目（補足到10道）
        const remainingSlots = questionsPerChallenge - selectedQuestions.length;
        if (remainingSlots > 0 && unansweredQuestions.length > 0) {
            const shuffledUnanswered = [...unansweredQuestions].sort(() => Math.random() - 0.5);
            const toAdd = Math.min(remainingSlots, shuffledUnanswered.length);
            selectedQuestions = selectedQuestions.concat(shuffledUnanswered.slice(0, toAdd));
            console.log('添加未答题目:', toAdd);
        }

        // 優先級3: 已答對的題目（補足到10道）
        const stillNeed = questionsPerChallenge - selectedQuestions.length;
        if (stillNeed > 0 && correctQuestions.length > 0) {
            const shuffledCorrect = [...correctQuestions].sort(() => Math.random() - 0.5);
            const toAdd = Math.min(stillNeed, shuffledCorrect.length);
            selectedQuestions = selectedQuestions.concat(shuffledCorrect.slice(0, toAdd));
            console.log('添加已答对题目:', toAdd);
        }

        // 最終隨機打亂順序
        selectedQuestions = selectedQuestions.sort(() => Math.random() - 0.5);

        // 嚴格限制為10道題
        const finalQuestions = selectedQuestions.slice(0, questionsPerChallenge);
        console.log('最终选择题目:', finalQuestions.length, finalQuestions.map(q => q.id));
        
        return finalQuestions;
    }
};

/**
 * 获取形状在特定类别中的特性
 */
function getShapePropertyInCategory(shapeName, category) {
    const shape = shapes[shapeName];
    if (!shape) return null;
    
    return shape.properties.find(prop => prop.category === category) || null;
}

/**
 * 获取特性的层次级别描述
 */
function getPropertyLevelInfo(category, level) {
    const categoryInfo = propertyCategories[category];
    if (!categoryInfo) return null;
    
    return categoryInfo.hierarchy.find(h => h.level === level) || null;
}

/**
 * 比较两个特性的层次关系
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
    isComparisonMode = false;
    
    // 更新变换区域显示
    updateTransformationArea(shapeName);
}

/**
 * 显示关系图
 */
function showRelationshipDiagram() {
    isRelationshipDiagramMode = true;
    
    // 隐藏形状显示SVG和属性面板
    const shapeSvg = document.getElementById('shape-svg');
    const relationshipSvg = document.getElementById('relationship-svg');
    const propertiesPanel = document.querySelector('.properties-panel');
    const relationshipNetwork = document.querySelector('.relationship-network');
    
    shapeSvg.style.display = 'none';
    relationshipSvg.style.display = 'block';
    propertiesPanel.style.display = 'none';
    relationshipNetwork.style.display = 'none';
    
    // 更新按钮状态
    document.querySelectorAll('.shape-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const diagramBtn = document.getElementById('relationship-diagram-btn');
    diagramBtn.classList.add('active');
    diagramBtn.textContent = '🔙 返回形狀學習';
    
    // 重置其他状态
    resetTransformationState();
}

/**
 * 隐藏关系图，切换回形状显示
 */
function hideRelationshipDiagram() {
    isRelationshipDiagramMode = false;
    
    // 显示形状显示SVG和属性面板
    const shapeSvg = document.getElementById('shape-svg');
    const relationshipSvg = document.getElementById('relationship-svg');
    const propertiesPanel = document.querySelector('.properties-panel');
    const relationshipNetwork = document.querySelector('.relationship-network');
    
    shapeSvg.style.display = 'block';
    relationshipSvg.style.display = 'none';
    propertiesPanel.style.display = 'block';
    relationshipNetwork.style.display = 'block';
    
    // 恢复按钮状态
    const diagramBtn = document.getElementById('relationship-diagram-btn');
    diagramBtn.classList.remove('active');
    diagramBtn.textContent = '圖形關係圖';
}

/**
 * 更新变换区域显示
 */
function updateTransformationArea(currentShapeName) {
    const networkContainer = document.querySelector('.network-container');
    const relationshipInfo = document.querySelector('.relationship-info');
    const relationshipText = document.getElementById('relationship-text');
    const animationControls = document.querySelector('.animation-controls');
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
            
            // 设置节点样式和内容
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
            
            // 添加动画效果
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
            
            // 触发动画
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
    relationshipText.innerHTML = `點擊下方任一形狀查看變換方式及比較特性`;
}

/**
 * 处理形状变换
 */
function handleShapeTransformation(sourceShape, targetShape) {
    const description = getTransformationDescription(sourceShape, targetShape);
    const relationshipInfo = document.querySelector('.relationship-info');
    const relationshipText = document.getElementById('relationship-text');
    const animationControls = document.querySelector('.animation-controls');
    const animateBtn = document.getElementById('animate-transformation-btn');
    const comparisonBtn = document.getElementById('comparison-btn');
    
    // 如果当前处于对比模式，先切换回形状详情
    if (isComparisonMode) {
        displayShape(targetShape);
        isComparisonMode = false;
    }
    
    // 保存变换状态
    animationState.sourceShape = sourceShape;
    animationState.targetShape = targetShape;
    
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
    
    // 隐藏控制按钮，直接开始动画
    animationControls.style.display = 'none';
    
    // 直接播放动画
    animateTransformation(sourceShape, targetShape);
}

/**
 * 切换特性对比显示
 */
function toggleComparison(sourceShape, targetShape) {
    const comparisonBtn = document.getElementById('comparison-btn');
    
    if (isComparisonMode) {
        // 当前是对比模式，切换回目标形状详情
        displayShape(sourceShape);
        comparisonBtn.textContent = '📊 顯示特性對比';
        isComparisonMode = false;
    } else {
        // 当前是形状详情，切换到对比模式
        displayShapeComparison(sourceShape, targetShape);
        comparisonBtn.textContent = '📋 返回形狀詳情';
        isComparisonMode = true;
    }
}

/**
 * 重置变换状态
 */
function resetTransformationState() {
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
    
    isComparisonMode = false;
}

/**
 * 处理形状选择（简化版，主要用于顶部按钮）
 */
function handleShapeSelection(shapeName) {
    // 如果当前在关系图模式，先切换回形状显示
    if (isRelationshipDiagramMode) {
        hideRelationshipDiagram();
    }
    
    resetTransformationState();
    updateActiveShape(shapeName);
    displayShape(shapeName);
}

/**
 * 显示形状对比 - 改进版本，移除返回按钮
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
}

/**
 * 动画变换函数 - 动画完成后显示控制按钮
 */
function animateTransformation(sourceShape, targetShape) {
    if (isAnimating) return;
    
    isAnimating = true;
    animationState.isActive = true;
    
    const polygon = document.getElementById('main-shape');
    const progressBar = document.querySelector('.progress-bar');
    const animationControls = document.querySelector('.animation-controls');
    const progressContainer = document.querySelector('.transformation-progress');
    const animateBtn = document.getElementById('animate-transformation-btn');
    const comparisonBtn = document.getElementById('comparison-btn');
    
    // 隐藏控制按钮，显示进度条
    animationControls.style.display = 'none';
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
            
            // 只显示目标形状，不自动切换到对比模式
            displayShape(targetShape);
            updateActiveShape(targetShape);
            
            // 短暂显示目标形状后回到源图形
            setTimeout(() => {
                // 回到源图形
                polygon.setAttribute('points', shapes[sourceShape].points);
                updateVisualMarkers(sourceShape);
                
                // 显示源图形的特性介绍
                displayShape(sourceShape);
                updateActiveShape(sourceShape);
                
                // 恢复控制按钮状态，并设置按钮功能
                setTimeout(() => {
                    progressContainer.style.display = 'none';
                    progressBar.style.width = '0%';
                    
                    // 设置按钮文字和功能
                    animateBtn.textContent = '🔄 再次播放';
                    animateBtn.onclick = () => {
                        animateTransformation(sourceShape, targetShape);
                    };
                    
                    comparisonBtn.textContent = '📊 顯示特性對比';
                    comparisonBtn.onclick = () => {
                        toggleComparison(sourceShape, targetShape);
                    };
                    
                    // 显示控制按钮
                    animationControls.style.display = 'flex';
                    
                    polygon.classList.remove('animating');
                    isAnimating = false;
                    animationState.isActive = false;
                }, 300);
            }, 800); // 显示目标形状800毫秒后回到源图形
        }
    }, stepDuration);
}

/**
 * 获取变换描述
 */
function getTransformationDescription(sourceShape, targetShape) {
    const transformKey = `${sourceShape}-${targetShape}`;
    return transformationPaths[transformKey] || '無法直接變換，請選擇其他路徑';
}

/**
 * 更新活动形状
 */
function updateActiveShape(shapeName) {
    document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`[data-shape="${shapeName}"]`);
    if (btn) btn.classList.add('active');
}

/**
 * 加载题目数据
 */
async function loadPracticesData() {
    try {
        const response = await fetch('./practices.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        practicesData = await response.json();
        questionBank = practicesData.questionBank;
        console.log(`成功加载 ${questionBank.length} 道题目`);
        return true;
    } catch (error) {
        console.error('加载题目数据失败:', error);
        // 如果加载失败，使用默认的少量题目
        questionBank = getDefaultQuestions();
        console.log('使用默认题目数据');
        return false;
    }
}

/**
 * 获取默认题目（当JSON加载失败时使用）
 */
function getDefaultQuestions() {
    return [
        {
            id: 1,
            shape: 'square',
            question: '正方形的四條邊都相等',
            answer: true,
            property: 'equal',
            explanation: '正方形的定義就是四條邊都相等且四個角都是直角的四邊形',
            category: 'sides',
            knowledgePoint: '正方形的邊長特性'
        },
        {
            id: 2,
            shape: 'rectangle',
            question: '長方形的四條邊都相等',
            answer: false,
            property: 'equal',
            explanation: '長方形只有對邊相等，長邊和短邊的長度不同',
            category: 'sides',
            knowledgePoint: '長方形的邊長特性'
        },
        {
            id: 3,
            shape: 'rhombus',
            question: '菱形的四條邊都相等',
            answer: true,
            property: 'equal',
            explanation: '菱形的定義就是四條邊都相等的平行四邊形',
            category: 'sides',
            knowledgePoint: '菱形的邊長特性'
        },
        {
            id: 4,
            shape: 'parallelogram',
            question: '平行四邊形的對邊平行',
            answer: true,
            property: 'parallel',
            explanation: '平行四邊形的定義就是兩組對邊分別平行的四邊形',
            category: 'parallel',
            knowledgePoint: '平行四邊形的平行特性'
        },
        {
            id: 5,
            shape: 'trapezoid',
            question: '梯形有一組對邊平行',
            answer: true,
            property: 'parallel',
            explanation: '梯形的定義就是有且僅有一組對邊平行的四邊形',
            category: 'parallel',
            knowledgePoint: '梯形的平行特性'
        }
    ];
}

/**
 * 开始挑战模式 - 异步版本
 */
async function startChallenge() {
    // 先检查数据是否已加载
    if (questionBank.length === 0) {
        // 显示加载提示
        showLoadingMessage('正在加載題目...');
        
        const loadSuccess = await loadPracticesData();
        hideLoadingMessage();
        
        if (!loadSuccess) {
            showErrorMessage('題目加載失败，使用默認題目');
        }
    }
    
    isChallengeMode = true;
    
    // 隐藏主界面，显示挑战界面
    const animationContainer = document.querySelector('.animation-container');
    const challengeContainer = document.querySelector('.challenge-container');
    const challengeResultContainer = document.querySelector('.challenge-result-container');
    
    animationContainer.style.display = 'none';
    challengeContainer.style.display = 'block';
    challengeResultContainer.style.display = 'none';
    
    // 隐藏其他所有按钮，只保留挑战按钮
    document.querySelectorAll('.shape-btn, .relationship-diagram-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.display = 'none';
    });
    
    const challengeBtn = document.getElementById('challenge-btn');
    challengeBtn.classList.add('active');
    challengeBtn.textContent = '🔙 返回學習';
    challengeBtn.style.display = 'block';
    
    // 初始化挑战状态
    initializeChallenge();
}

/**
 * 显示加载消息
 */
function showLoadingMessage(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-message';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 20px 40px;
        border-radius: 15px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        z-index: 1000;
        text-align: center;
        font-size: 16px;
        font-weight: bold;
        color: #333;
    `;
    loadingDiv.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #4CAF50; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
        ${message}
    `;
    
    // 添加旋转动画的CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loadingDiv);
}

/**
 * 隐藏加载消息
 */
function hideLoadingMessage() {
    const loadingDiv = document.getElementById('loading-message');
    if (loadingDiv) {
        document.body.removeChild(loadingDiv);
    }
}

/**
 * 显示错误消息
 */
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
        z-index: 1000;
        font-size: 14px;
        font-weight: bold;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
        }
    }, 3000);
}

/**
 * 退出挑战模式
 */
function exitChallenge() {
    isChallengeMode = false;
    
    // 显示主界面，隐藏挑战界面
    const animationContainer = document.querySelector('.animation-container');
    const challengeContainer = document.querySelector('.challenge-container');
    const challengeResultContainer = document.querySelector('.challenge-result-container');
    
    animationContainer.style.display = 'block';
    challengeContainer.style.display = 'none';
    challengeResultContainer.style.display = 'none';
    
    // 恢复所有按钮的显示
    document.querySelectorAll('.shape-btn, .relationship-diagram-btn').forEach(btn => {
        btn.style.display = 'block';
    });
    
    // 恢复挑战按钮状态
    const challengeBtn = document.getElementById('challenge-btn');
    challengeBtn.classList.remove('active');
    challengeBtn.textContent = '🎯 知識挑戰';
    
    // 显示当前选中的形状
    hideRelationshipDiagram();
    handleShapeSelection(currentShape);
}

/**
 * 初始化挑战 - 修改版：處理選擇0道題目的情況
 */
function initializeChallenge() {
    // 开始新挑战，更新进度
    const progress = ProgressManager.startChallenge();
    
    // 检查是否完成所有挑战
    if (ProgressManager.isAllCompleted()) {
        showCompletionMessage();
        return;
    }
    
    // 智能选择题目
    const selectedQuestions = QuestionSelector.selectQuestionsForChallenge();
    
    // 如果沒有選到題目（極端情況），顯示完成消息
    if (selectedQuestions.length === 0) {
        showCompletionMessage();
        return;
    }
    
    // 重置挑战状态
    challengeState = {
        questions: selectedQuestions,
        currentQuestionIndex: 0,
        score: 0,
        wrongQuestions: [],
        totalQuestions: selectedQuestions.length, // 使用實際選擇的題目數量
        isAnswered: false
    };
    
    // 确保图形区域被隐藏
    const shapeDisplay = document.querySelector('.question-shape-display');
    const questionArea = document.querySelector('.question-area');
    shapeDisplay.classList.add('hidden');
    questionArea.classList.add('shape-hidden');
    
    // 更新UI
    updateChallengeProgress();
    displayCurrentQuestion();
}

/**
 * 显示完成消息 - 修正：使用动态题目总数
 */
function showCompletionMessage() {
    const totalQuestions = getTotalQuestionCount();
    const challengeContainer = document.querySelector('.challenge-container');
    challengeContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
            <div style="font-size: 80px; margin-bottom: 30px;">🎉</div>
            <h2 style="color: #4CAF50; margin-bottom: 20px; font-size: 2.5em;">挑戰完成！</h2>
            <p style="font-size: 1.4em; color: #666; margin-bottom: 30px;">
                恭喜你已經完成所有${totalQuestions}道題目的挑戰！<br>
                你對四邊形的知識掌握得非常好！
            </p>
            <div style="margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; display: inline-block; padding: 15px 30px; border-radius: 25px; font-size: 1.2em; font-weight: bold;">
                    大師級別 🏆
                </div>
            </div>
            <div style="margin-top: 40px;">
                <button onclick="ProgressManager.resetProgress(); initializeChallenge();" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer; margin-right: 15px;">
                    🔄 重新開始所有挑戰
                </button>
                <button onclick="exitChallenge();" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; font-weight: bold; cursor: pointer;">
                    🏠 返回學習
                </button>
            </div>
        </div>
    `;
}

/**
 * 更新挑战进度显示
 */
function updateChallengeProgress() {
    const questionCounter = document.getElementById('question-counter');
    const correctCount = document.getElementById('correct-count');
    const wrongCount = document.getElementById('wrong-count');
    
    questionCounter.textContent = `第 ${challengeState.currentQuestionIndex + 1} 題 / ${challengeState.totalQuestions} 題`;
    correctCount.textContent = challengeState.score;
    wrongCount.textContent = challengeState.wrongQuestions.length;
}

/**
 * 显示当前题目
 */
function displayCurrentQuestion() {
    const question = challengeState.questions[challengeState.currentQuestionIndex];
    if (!question) {
        showChallengeResult();
        return;
    }
    
    // 更新题目显示
    const questionText = document.getElementById('current-question');
    const shapeTitle = document.getElementById('challenge-shape-title');
    const answerFeedback = document.querySelector('.answer-feedback');
    const answerButtons = document.querySelectorAll('.answer-btn');
    const shapeDisplay = document.querySelector('.question-shape-display');
    const questionArea = document.querySelector('.question-area');
    
    questionText.textContent = question.question;
    shapeTitle.textContent = shapes[question.shape].title;
    answerFeedback.style.display = 'none';
    
    // 重置答题按钮
    answerButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    
    challengeState.isAnswered = false;
    
    // 确保图形完全隐藏
    shapeDisplay.classList.add('hidden');
    questionArea.classList.add('shape-hidden');
    
    // 预先准备形状，但不显示
    displayChallengeShape(question.shape);
    
    // 清除所有视觉高亮
    document.querySelectorAll('#challenge-shape-svg .visual-element').forEach(el => {
        el.classList.remove('highlight');
    });
}

/**
 * 显示挑战模式的形状
 */
function displayChallengeShape(shapeName) {
    const shape = shapes[shapeName];
    if (!shape) return;
    
    const polygon = document.getElementById('challenge-main-shape');
    polygon.setAttribute('points', shape.points);
    
    // 更新视觉标记（挑战模式）
    updateChallengeVisualMarkers(shapeName);
}

/**
 * 更新挑战模式的视觉标记
 */
function updateChallengeVisualMarkers(shapeName) {
    const shape = shapes[shapeName];
    if (!shape || !shape.visualElements) return;
    
    const points = shape.points.split(' ').map(p => {
        const [x, y] = p.split(',').map(Number);
        return { x, y };
    });

    // 清除所有标记
    document.querySelectorAll('#challenge-shape-svg .visual-element').forEach(el => {
        el.style.display = 'none';
    });

    // 清除所有角度标记
    for (let i = 1; i <= 4; i++) {
        const angleDot = document.getElementById(`challenge-angle-dot${i}`);
        if (angleDot) {
            angleDot.setAttribute('r', '0');
            angleDot.setAttribute('cx', '0');
            angleDot.setAttribute('cy', '0');
        }
    }

    // 复制主要updateVisualMarkers函数的逻辑，但使用challenge前缀的元素
    // 设置平行线标记
    if (shape.visualElements.parallel && shape.visualElements.parallel.show) {
        const parallelMarks = document.getElementById('challenge-parallel-marks');
        parallelMarks.style.display = 'block';
        
        if (shapeName === 'trapezoid') {
            // 梯形只显示一组平行线
            const topMidX = (points[0].x + points[1].x) / 2;
            const topMidY = (points[0].y + points[1].y) / 2;
            const bottomMidX = (points[2].x + points[3].x) / 2;
            const bottomMidY = (points[2].y + points[3].y) / 2;
            
            const parallel1a = document.getElementById('challenge-parallel1a');
            const parallel1b = document.getElementById('challenge-parallel1b');
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
        } else {
            // 其他形状显示两组平行线
            const topMidX = (points[0].x + points[1].x) / 2;
            const topMidY = (points[0].y + points[1].y) / 2;
            const bottomMidX = (points[2].x + points[3].x) / 2;
            const bottomMidY = (points[2].y + points[3].y) / 2;
            
            const parallel1a = document.getElementById('challenge-parallel1a');
            const parallel1b = document.getElementById('challenge-parallel1b');
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
            
            const parallel2a = document.getElementById('challenge-parallel2a');
            const parallel2b = document.getElementById('challenge-parallel2b');
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
        const angleMarks = document.getElementById('challenge-angle-marks');
        angleMarks.style.display = 'block';
        
        for (let i = 0; i < 4; i++) {
            const angle = document.getElementById(`challenge-angle${i + 1}`);
            if (angle) {
                const corner = points[i];
                angle.setAttribute('x', corner.x - 7.5);
                angle.setAttribute('y', corner.y - 7.5);
            }
        }
    }

    // 设置一般角度标记
    if (shape.visualElements.generalAngle && shape.visualElements.generalAngle.show) {
        const angleMarksGeneral = document.getElementById('challenge-angle-marks-general');
        angleMarksGeneral.style.display = 'block';
        
        if (shapeName === 'rhombus') {
            // 菱形角度标记
            const corner0 = points[0];
            const corner1 = points[1];
            const corner2 = points[2];
            const corner3 = points[3];
            
            const dot1 = document.getElementById('challenge-angle-dot1');
            const dot3 = document.getElementById('challenge-angle-dot3');
            if (dot1 && dot3) {
                dot1.setAttribute('cx', corner0.x);
                dot1.setAttribute('cy', corner0.y);
                dot1.setAttribute('r', '3');
                
                dot3.setAttribute('cx', corner2.x);
                dot3.setAttribute('cy', corner2.y);
                dot3.setAttribute('r', '3');
            }
            
            const dot2 = document.getElementById('challenge-angle-dot2');
            const dot4 = document.getElementById('challenge-angle-dot4');
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
                const angleDot = document.getElementById(`challenge-angle-dot${i + 1}`);
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
    }

    // 设置相等边标记（简化版本）
    if (shape.visualElements.equal && shape.visualElements.equal.show) {
        const equalMarks = document.getElementById('challenge-equal-marks');
        equalMarks.style.display = 'block';
        
        // 这里可以添加相等边标记的具体实现，类似主SVG的逻辑
    }

    // 设置对角线
    if (shape.visualElements.diagonal && shape.visualElements.diagonal.show) {
        const diagonalMarks = document.getElementById('challenge-diagonal-marks');
        diagonalMarks.style.display = 'block';
        
        const diagonal1 = document.getElementById('challenge-diagonal1');
        const diagonal2 = document.getElementById('challenge-diagonal2');
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
 * 高亮挑战模式的视觉元素
 */
function highlightChallengeVisualElement(visualType) {
    document.querySelectorAll('#challenge-shape-svg .visual-element').forEach(el => {
        el.classList.remove('highlight');
    });

    let targetElement = null;
    switch(visualType) {
        case 'parallel':
            targetElement = document.getElementById('challenge-parallel-marks');
            break;
        case 'equal':
            targetElement = document.getElementById('challenge-equal-marks');
            break;
        case 'equal-sides':
            targetElement = document.getElementById('challenge-sides-marks');
            break;
        case 'right-angle':
            targetElement = document.getElementById('challenge-angle-marks');
            break;
        case 'general-angle':
            targetElement = document.getElementById('challenge-angle-marks-general');
            break;
        case 'diagonal':
            targetElement = document.getElementById('challenge-diagonal-marks');
            break;
    }
    
    if (targetElement) {
        targetElement.style.display = 'block';
        targetElement.classList.add('highlight');
    }
}

/**
 * 处理答题 - 核心修改：答对直接进入下一题，答错显示图形和提示，同时记录到Cookie
 */
function handleAnswer(selectedAnswer) {
    if (challengeState.isAnswered) return;
    
    challengeState.isAnswered = true;
    const question = challengeState.questions[challengeState.currentQuestionIndex];
    const isCorrect = selectedAnswer === question.answer;
    
    // 禁用答题按钮
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
    });
    
    // 记录答题结果到Cookie
    ProgressManager.recordAnswer(question.id, isCorrect);
    
    // 更新分数和错题记录
    if (isCorrect) {
        challengeState.score++;
        // 答对了，显示简短提示后直接进入下一题
        showCorrectFeedback();
    } else {
        challengeState.wrongQuestions.push({
            question: question,
            userAnswer: selectedAnswer,
            correctAnswer: question.answer,
            questionIndex: challengeState.currentQuestionIndex
        });
        // 答错了，显示图形和详细反馈
        showWrongFeedback(question);
    }
    
    // 更新进度显示
    updateChallengeProgress();
}

/**
 * 显示答对的反馈（简短提示后自动进入下一题）
 */
function showCorrectFeedback() {
    // 显示绿色的正确提示
    const correctFeedback = document.createElement('div');
    correctFeedback.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
        color: white;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 20px;
        font-weight: bold;
        z-index: 1000;
        box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
        animation: correctPulse 0.6s ease;
    `;
    correctFeedback.innerHTML = '🎉 答對了！';
    
    document.body.appendChild(correctFeedback);
    
    // 1.2秒后移除提示并进入下一题
    setTimeout(() => {
        document.body.removeChild(correctFeedback);
        
        // 进入下一题或显示结果
        if (challengeState.currentQuestionIndex < challengeState.totalQuestions - 1) {
            nextQuestion();
        } else {
            showChallengeResult();
        }
    }, 1200);
}

/**
 * 显示答错的反馈（显示图形和详细解释）
 */
function showWrongFeedback(question) {
    // 显示图形区域
    const shapeDisplay = document.querySelector('.question-shape-display');
    const questionArea = document.querySelector('.question-area');
    const answerFeedback = document.querySelector('.answer-feedback');
    const feedbackIcon = document.querySelector('.feedback-icon');
    const feedbackText = document.querySelector('.feedback-text');
    const nextBtn = document.querySelector('.next-question-btn');
    
    // 显示图形
    shapeDisplay.classList.remove('hidden');
    questionArea.classList.remove('shape-hidden');
    
    // 显示详细反馈
    answerFeedback.style.display = 'block';
    feedbackIcon.className = 'feedback-icon wrong';
    feedbackText.innerHTML = `
        <strong>❌ 答錯了！</strong><br>
        正確答案：<strong>${question.answer ? '正確' : '錯誤'}</strong><br>
        <div style="margin-top: 10px; color: #666;">${question.explanation}</div>
    `;
    feedbackIcon.style.color = '#ff6b6b';
    
    // 高亮对应的图形特性
    if (question.property) {
        setTimeout(() => {
            highlightChallengeVisualElement(question.property);
        }, 300);
    }
    
    // 设置下一题按钮
    if (challengeState.currentQuestionIndex < challengeState.totalQuestions - 1) {
        nextBtn.textContent = '理解了，下一題 →';
        nextBtn.onclick = nextQuestion;
    } else {
        nextBtn.textContent = '查看最終結果 →';
        nextBtn.onclick = showChallengeResult;
    }
}

/**
 * 下一题
 */
function nextQuestion() {
    challengeState.currentQuestionIndex++;
    
    // 确保重新隐藏图形区域
    const shapeDisplay = document.querySelector('.question-shape-display');
    const questionArea = document.querySelector('.question-area');
    shapeDisplay.classList.add('hidden');
    questionArea.classList.add('shape-hidden');
    
    displayCurrentQuestion();
}

/**
 * 显示挑战结果
 */
function showChallengeResult() {
    const challengeContainer = document.querySelector('.challenge-container');
    const challengeResultContainer = document.querySelector('.challenge-result-container');
    
    challengeContainer.style.display = 'none';
    challengeResultContainer.style.display = 'block';
    
    // 更新结果显示
    updateResultDisplay();
}

/**
 * 更新结果显示 - 修正：使用动态题目总数
 */
function updateResultDisplay() {
    const finalScoreText = document.getElementById('final-score-text');
    const accuracyRate = document.getElementById('accuracy-rate');
    const correctTotal = document.getElementById('correct-total');
    const wrongTotal = document.getElementById('wrong-total');
    const wrongQuestionsReview = document.getElementById('wrong-questions-review');
    const wrongQuestionsList = document.getElementById('wrong-questions-list');
    const knowledgePointsSummary = document.getElementById('knowledge-points-summary');
    const knowledgePointsList = document.getElementById('knowledge-points-list');
    
    // 获取总体进度
    const progress = ProgressManager.getProgress();
    const totalQuestions = getTotalQuestionCount(); // 使用动态题目总数
    
    // 基本统计
    const accuracy = Math.round((challengeState.score / challengeState.totalQuestions) * 100);
    finalScoreText.textContent = `${challengeState.score}/${challengeState.totalQuestions}`;
    accuracyRate.textContent = `${accuracy}%`;
    correctTotal.textContent = challengeState.score;
    wrongTotal.textContent = challengeState.wrongQuestions.length;
    
    // 调整分数圆圈颜色
    const scoreCircle = document.querySelector('.score-circle');
    if (accuracy >= 80) {
        scoreCircle.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    } else if (accuracy >= 60) {
        scoreCircle.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
    } else {
        scoreCircle.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
    }
    
    // 在结果头部添加总体进度信息 - 修正：使用动态题目总数
    const resultHeader = document.querySelector('.result-header');
    const existingProgress = resultHeader.querySelector('.overall-progress');
    if (existingProgress) {
        existingProgress.remove();
    }
    
    const overallProgressDiv = document.createElement('div');
    overallProgressDiv.className = 'overall-progress';
    overallProgressDiv.style.cssText = `
        background: #f8f9ff;
        border-radius: 15px;
        padding: 20px;
        margin-top: 20px;
        text-align: center;
    `;
    
    const completionRate = Math.round((progress.correctQuestions.length / totalQuestions) * 100);
    overallProgressDiv.innerHTML = `
        <h3 style="margin-bottom: 15px; color: #333;">📊 總體學習進度</h3>
        <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 15px;">
            <div>
                <span style="display: block; font-size: 24px; font-weight: bold; color: #4CAF50;">${progress.correctQuestions.length}/${totalQuestions}</span>
                <span style="font-size: 14px; color: #666;">已掌握題目</span>
            </div>
            <div>
                <span style="display: block; font-size: 24px; font-weight: bold; color: #FF9800;">${progress.wrongQuestions.length}</span>
                <span style="font-size: 14px; color: #666;">需要復習</span>
            </div>
            <div>
                <span style="display: block; font-size: 24px; font-weight: bold; color: #667eea;">${progress.challengeCount}</span>
                <span style="font-size: 14px; color: #666;">挑戰次數</span>
            </div>
        </div>
        <div style="background: #e0e0e0; border-radius: 10px; overflow: hidden; height: 10px; margin-bottom: 10px;">
            <div style="background: linear-gradient(90deg, #4CAF50, #45a049); height: 100%; width: ${completionRate}%; transition: width 0.5s ease;"></div>
        </div>
        <span style="font-size: 16px; font-weight: bold; color: #333;">完成度: ${completionRate}%</span>
    `;
    
    resultHeader.appendChild(overallProgressDiv);
    
    // 错题复习
    if (challengeState.wrongQuestions.length > 0) {
        wrongQuestionsReview.style.display = 'block';
        wrongQuestionsList.innerHTML = '';
        
        challengeState.wrongQuestions.forEach((wrongQ, index) => {
            const wrongItem = document.createElement('div');
            wrongItem.className = 'wrong-question-item';
            wrongItem.innerHTML = `
                <div class="wrong-question-text">
                    第${wrongQ.questionIndex + 1}題：${wrongQ.question.question}
                </div>
                <div class="correct-answer">
                    正確答案：${wrongQ.correctAnswer ? '正確' : '錯誤'} | 
                    你的答案：${wrongQ.userAnswer ? '正確' : '錯誤'}
                </div>
            `;
            wrongQuestionsList.appendChild(wrongItem);
        });
        
        // 知识点总结 - 改进版本
        const knowledgePoints = {};
        challengeState.wrongQuestions.forEach(wrongQ => {
            const category = wrongQ.question.category;
            const knowledgePoint = wrongQ.question.knowledgePoint;
            
            if (!knowledgePoints[category]) {
                knowledgePoints[category] = new Set();
            }
            knowledgePoints[category].add(knowledgePoint);
        });
        
        if (Object.keys(knowledgePoints).length > 0) {
            knowledgePointsSummary.style.display = 'block';
            knowledgePointsList.innerHTML = '';
            
            Object.entries(knowledgePoints).forEach(([category, points]) => {
                points.forEach(point => {
                    const pointItem = document.createElement('div');
                    pointItem.className = 'knowledge-point-item';
                    
                    // 获取分类中文名称
                    let categoryName = category;
                    if (propertyCategories[category]) {
                        categoryName = propertyCategories[category].name;
                    } else if (practicesData && practicesData.categories) {
                        const categoryInfo = practicesData.categories.find(cat => cat.id === category);
                        if (categoryInfo) {
                            categoryName = categoryInfo.name;
                        }
                    }
                    
                    pointItem.innerHTML = `
                        <div class="knowledge-point-category">${point}</div>
                        <div class="knowledge-point-details">建議複習 ${categoryName} 相關知識</div>
                    `;
                    knowledgePointsList.appendChild(pointItem);
                });
            });
        }
    } else {
        wrongQuestionsReview.style.display = 'none';
        knowledgePointsSummary.style.display = 'none';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 预加载题目数据
    console.log('开始预加载题目数据...');
    await loadPracticesData();
    
    // 形状按钮事件监听
    document.querySelectorAll('.shape-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleShapeSelection(btn.dataset.shape);
        });
    });

    // 关系图按钮事件监听
    document.getElementById('relationship-diagram-btn').addEventListener('click', () => {
        if (isRelationshipDiagramMode) {
            // 当前在关系图模式，切换回形状显示
            hideRelationshipDiagram();
            // 显示当前选中的形状
            handleShapeSelection(currentShape);
        } else {
            // 当前在形状显示模式，切换到关系图
            showRelationshipDiagram();
        }
    });

    // 挑战按钮事件监听（异步版本）
    document.getElementById('challenge-btn').addEventListener('click', async () => {
        if (isChallengeMode) {
            // 当前在挑战模式，返回主界面
            exitChallenge();
        } else {
            // 当前在主界面，进入挑战模式
            await startChallenge();
        }
    });

    // 挑战界面事件监听
    // 答题按钮
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const answer = e.target.dataset.answer === 'true';
            handleAnswer(answer);
        });
    });

    // 结果界面按钮
    document.getElementById('restart-challenge-btn').addEventListener('click', () => {
        initializeChallenge();
        const challengeContainer = document.querySelector('.challenge-container');
        const challengeResultContainer = document.querySelector('.challenge-result-container');
        challengeContainer.style.display = 'block';
        challengeResultContainer.style.display = 'none';
    });

    document.getElementById('result-home-btn').addEventListener('click', () => {
        exitChallenge();
    });

    // 关系图中图形区域的点击事件
   document.querySelectorAll('#relationship-svg rect[data-shape]').forEach(rect => {
        rect.addEventListener('click', (e) => {
            e.stopPropagation();
            const shapeName = rect.getAttribute('data-shape');
            if (shapeName && shapes[shapeName]) {
                // 切换到对应的形状显示
                hideRelationshipDiagram();
                handleShapeSelection(shapeName);
            }
        });
    });
    // 添加hover效果處理，讓長方形和菱形在hover時能完整顯示
    const rectangleRect = document.querySelector('#relationship-svg rect[data-shape="rectangle"]');
    const rhombusRect = document.querySelector('#relationship-svg rect[data-shape="rhombus"]');
    const squareRect = document.querySelector('#relationship-svg rect[data-shape="square"]');

    // 長方形hover效果
    if (rectangleRect && squareRect && rhombusRect) {
        rectangleRect.addEventListener('mouseenter', () => {
            squareRect.classList.add('dimmed');
            rhombusRect.classList.add('dimmed'); // 新增：讓菱形也變暗
        });
        
        rectangleRect.addEventListener('mouseleave', () => {
            squareRect.classList.remove('dimmed');
            rhombusRect.classList.remove('dimmed'); // 新增：恢復菱形
        });
    }

    // 菱形hover效果
    if (rhombusRect && squareRect) {
        rhombusRect.addEventListener('mouseenter', () => {
            squareRect.classList.add('dimmed');
        });
        
        rhombusRect.addEventListener('mouseleave', () => {
            squareRect.classList.remove('dimmed');
        });
    }
    // 关系图中可点击文本的事件
    document.querySelectorAll('#relationship-svg text[style*="cursor: pointer"]').forEach(text => {
        text.addEventListener('click', (e) => {
            e.stopPropagation();
            // 根据文本内容判断对应的形状
            const textContent = text.textContent;
            if (textContent.includes('梯形')) {
                hideRelationshipDiagram();
                handleShapeSelection('trapezoid');
            } else if (textContent.includes('長方形')) {
                hideRelationshipDiagram();
                handleShapeSelection('rectangle');
            } else if (textContent.includes('菱形')) {
                hideRelationshipDiagram();
                handleShapeSelection('rhombus');
            } else if (textContent.includes('正方形')) {
                hideRelationshipDiagram();
                handleShapeSelection('square');
            } else if (textContent.includes('平行四邊形')) {
                hideRelationshipDiagram();
                handleShapeSelection('parallelogram');
            }
        });
    });

    // 点击空白处重置选择状态
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.shape-node') && 
            !e.target.closest('.relationship-info') &&
            !e.target.closest('.property') &&
            !e.target.closest('.property-comparison') &&
            !e.target.closest('.animation-controls') &&
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