// data.js - 数据定义和配置
// =====================================================

// 应用配置常量
const CONFIG = {
    ANIMATION_DURATION: 3000,
    QUESTIONS_PER_CHALLENGE: 10,
    COOKIE_EXPIRY_DAYS: 365,
    PROGRESS_COOKIE_NAME: 'quadrilateral_progress'
};

// 四边形数据定义
const SHAPES_DATA = {
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
const PROPERTY_CATEGORIES = {
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

// 变换路径定义
const TRANSFORMATION_PATHS = {
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

// 默认题目数据（当JSON加载失败时使用）
const DEFAULT_QUESTIONS = [
    {
        id: 1,
        shape: 'square',
        question: '正方形的四條邊都相等',
        answer: true,
        property: 'equal',
        explanation: '正方形的定義就是四條邊都相等且四個角都是直角的四邊形',
        category: 'sides',
        knowledgePoint: '正方形的邊長特性',
        difficulty: 'easy'
    },
    {
        id: 2,
        shape: 'rectangle',
        question: '長方形的四條邊都相等',
        answer: false,
        property: 'equal',
        explanation: '長方形只有對邊相等，長邊和短邊的長度不同',
        category: 'sides',
        knowledgePoint: '長方形的邊長特性',
        difficulty: 'easy'
    },
    {
        id: 3,
        shape: 'rhombus',
        question: '菱形的四條邊都相等',
        answer: true,
        property: 'equal',
        explanation: '菱形的定義就是四條邊都相等的平行四邊形',
        category: 'sides',
        knowledgePoint: '菱形的邊長特性',
        difficulty: 'easy'
    },
    {
        id: 4,
        shape: 'parallelogram',
        question: '平行四邊形的對邊平行',
        answer: true,
        property: 'parallel',
        explanation: '平行四邊形的定義就是兩組對邊分別平行的四邊形',
        category: 'parallel',
        knowledgePoint: '平行四邊形的平行特性',
        difficulty: 'easy'
    },
    {
        id: 5,
        shape: 'trapezoid',
        question: '梯形有一組對邊平行',
        answer: true,
        property: 'parallel',
        explanation: '梯形的定義就是有且僅有一組對邊平行的四邊形',
        category: 'parallel',
        knowledgePoint: '梯形的平行特性',
        difficulty: 'easy'
    },
    {
        id: 6,
        shape: 'square',
        question: '正方形的四個角都是直角',
        answer: true,
        property: 'right-angle',
        explanation: '正方形是特殊的長方形，所以四個角都必須是直角',
        category: 'angles',
        knowledgePoint: '正方形的角度特性',
        difficulty: 'easy'
    },
    {
        id: 7,
        shape: 'rhombus',
        question: '菱形的四個角都是直角',
        answer: false,
        property: 'general-angle',
        explanation: '菱形只有對角相等，不一定都是直角。只有當菱形是正方形時，四個角才都是直角',
        category: 'angles',
        knowledgePoint: '菱形的角度特性',
        difficulty: 'medium'
    },
    {
        id: 8,
        shape: 'parallelogram',
        question: '平行四邊形的對角相等',
        answer: true,
        property: 'general-angle',
        explanation: '平行四邊形的性質之一就是對角相等',
        category: 'angles',
        knowledgePoint: '平行四邊形的角度特性',
        difficulty: 'medium'
    },
    {
        id: 9,
        shape: 'rectangle',
        question: '長方形的對角線相等',
        answer: true,
        property: 'diagonal',
        explanation: '長方形的兩條對角線長度相等，這是長方形的重要特性',
        category: 'diagonals',
        knowledgePoint: '長方形的對角線特性',
        difficulty: 'medium'
    },
    {
        id: 10,
        shape: 'square',
        question: '正方形的對角線垂直且相等',
        answer: true,
        property: 'diagonal',
        explanation: '正方形同時具有長方形和菱形的特性，所以對角線既相等又垂直',
        category: 'diagonals',
        knowledgePoint: '正方形的對角線特性',
        difficulty: 'hard'
    }
];

// 导出所有数据（如果使用ES6模块）
// export { CONFIG, SHAPES_DATA, PROPERTY_CATEGORIES, TRANSFORMATION_PATHS, DEFAULT_QUESTIONS };

// 或者挂载到全局对象（当前方式）
window.AppData = {
    CONFIG,
    SHAPES_DATA,
    PROPERTY_CATEGORIES, 
    TRANSFORMATION_PATHS,
    DEFAULT_QUESTIONS
};