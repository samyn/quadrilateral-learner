// utils.js - 工具类和管理类
// =====================================================

// Cookie 管理类
class CookieManager {
    /**
     * 设置Cookie
     */
    static set(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
    }

    /**
     * 获取Cookie
     */
    static get(name) {
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
    }

    /**
     * 删除Cookie
     */
    static remove(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}

// 答题记录管理类
class ProgressManager {
    static get COOKIE_NAME() {
        return window.AppData.CONFIG.PROGRESS_COOKIE_NAME;
    }

    /**
     * 获取学习进度
     */
    static getProgress() {
        const progress = CookieManager.get(this.COOKIE_NAME);
        if (!progress) {
            return {
                answeredQuestions: [],
                correctQuestions: [],
                wrongQuestions: [],
                challengeCount: 0,
                totalCorrect: 0,
                totalWrong: 0,
                lastChallengeDate: null
            };
        }
        return progress;
    }

    /**
     * 保存学习进度
     */
    static saveProgress(progress) {
        CookieManager.set(this.COOKIE_NAME, progress);
    }

    /**
     * 记录答题结果
     */
    static recordAnswer(questionId, isCorrect) {
        const progress = this.getProgress();
        
        if (!progress.answeredQuestions.includes(questionId)) {
            progress.answeredQuestions.push(questionId);
        }

        if (isCorrect) {
            if (!progress.correctQuestions.includes(questionId)) {
                progress.correctQuestions.push(questionId);
                progress.totalCorrect++;
            }
            const wrongIndex = progress.wrongQuestions.indexOf(questionId);
            if (wrongIndex > -1) {
                progress.wrongQuestions.splice(wrongIndex, 1);
            }
        } else {
            if (!progress.wrongQuestions.includes(questionId)) {
                progress.wrongQuestions.push(questionId);
                progress.totalWrong++;
            }
        }

        this.saveProgress(progress);
        return progress;
    }

    /**
     * 开始新的挑战
     */
    static startChallenge() {
        const progress = this.getProgress();
        progress.challengeCount++;
        progress.lastChallengeDate = new Date().toISOString();
        this.saveProgress(progress);
        return progress;
    }

    /**
     * 检查是否完成所有挑战
     */
    static isAllCompleted() {
        const progress = this.getProgress();
        const totalQuestions = DataLoader.getTotalQuestionCount();
        return progress.correctQuestions.length === totalQuestions && progress.wrongQuestions.length === 0;
    }

    /**
     * 重置进度
     */
    static resetProgress() {
        CookieManager.remove(this.COOKIE_NAME);
    }
}

// 智能出题算法类
class QuestionSelector {
    /**
     * 选择本次挑战的题目
     */
    static selectQuestionsForChallenge() {
        const progress = ProgressManager.getProgress();
        const allQuestions = [...DataLoader.getQuestionBank()];
        const questionsPerChallenge = window.AppData.CONFIG.QUESTIONS_PER_CHALLENGE;

        if (ProgressManager.isAllCompleted()) {
            console.log('恭喜！已完成所有挑戰！');
            return [];
        }

        const unansweredQuestions = allQuestions.filter(q => !progress.answeredQuestions.includes(q.id));
        const wrongQuestions = allQuestions.filter(q => progress.wrongQuestions.includes(q.id));
        const correctQuestions = allQuestions.filter(q => progress.correctQuestions.includes(q.id));

        let selectedQuestions = [];

        // 优先级1: 错题
        if (wrongQuestions.length > 0) {
            const shuffledWrong = [...wrongQuestions].sort(() => Math.random() - 0.5);
            const wrongToAdd = Math.min(questionsPerChallenge, shuffledWrong.length);
            selectedQuestions = selectedQuestions.concat(shuffledWrong.slice(0, wrongToAdd));
        }

        // 优先级2: 未答过的题目
        const remainingSlots = questionsPerChallenge - selectedQuestions.length;
        if (remainingSlots > 0 && unansweredQuestions.length > 0) {
            const shuffledUnanswered = [...unansweredQuestions].sort(() => Math.random() - 0.5);
            const toAdd = Math.min(remainingSlots, shuffledUnanswered.length);
            selectedQuestions = selectedQuestions.concat(shuffledUnanswered.slice(0, toAdd));
        }

        // 优先级3: 已答对的题目
        const stillNeed = questionsPerChallenge - selectedQuestions.length;
        if (stillNeed > 0 && correctQuestions.length > 0) {
            const shuffledCorrect = [...correctQuestions].sort(() => Math.random() - 0.5);
            const toAdd = Math.min(stillNeed, shuffledCorrect.length);
            selectedQuestions = selectedQuestions.concat(shuffledCorrect.slice(0, toAdd));
        }

        return selectedQuestions.sort(() => Math.random() - 0.5).slice(0, questionsPerChallenge);
    }
}

// 数据加载管理类
class DataLoader {
    static questionBank = [];
    static practicesData = null;

    /**
     * 加载题目数据
     */
    static async loadPracticesData() {
        try {
            const response = await fetch('./practices.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.practicesData = await response.json();
            this.questionBank = this.practicesData.questionBank;
            console.log(`成功加载 ${this.questionBank.length} 道题目`);
            return true;
        } catch (error) {
            console.error('加载题目数据失败:', error);
            this.questionBank = window.AppData.DEFAULT_QUESTIONS;
            console.log('使用默认题目数据');
            return false;
        }
    }

    /**
     * 获取题目库
     */
    static getQuestionBank() {
        return this.questionBank;
    }

    /**
     * 获取题目总数
     */
    static getTotalQuestionCount() {
        return this.questionBank.length;
    }
}

// UI 工具类
class UIUtils {
    /**
     * 显示加载消息
     */
    static showLoadingMessage(message) {
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
        
        this.ensureSpinAnimation();
        document.body.appendChild(loadingDiv);
    }

    /**
     * 隐藏加载消息
     */
    static hideLoadingMessage() {
        const loadingDiv = document.getElementById('loading-message');
        if (loadingDiv) {
            document.body.removeChild(loadingDiv);
        }
    }

    /**
     * 显示错误消息
     */
    static showErrorMessage(message) {
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
        
        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 3000);
    }

    /**
     * 确保旋转动画CSS存在
     */
    static ensureSpinAnimation() {
        if (!document.getElementById('spin-animation-style')) {
            const style = document.createElement('style');
            style.id = 'spin-animation-style';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// 导出类（如果使用ES6模块）
// export { CookieManager, ProgressManager, QuestionSelector, DataLoader, UIUtils };

// 或者挂载到全局对象
window.AppUtils = {
    CookieManager,
    ProgressManager,
    QuestionSelector,
    DataLoader,
    UIUtils
};