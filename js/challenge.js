// challenge.js - 挑战模式功能
// =====================================================

// 挑战模块
class ChallengeModule {
    
    /**
     * 初始化模块
     */
    static init() {
        // 初始化时隐藏挑战界面
        const challengeContainer = document.querySelector('.challenge-container');
        if (challengeContainer) {
            challengeContainer.style.display = 'none';
        }
    }

    /**
     * 开始挑战模式
     */
    static async startChallenge() {
        // 先检查数据是否已加载
        if (window.AppUtils.DataLoader.getQuestionBank().length === 0) {
            // 显示加载提示
            window.AppUtils.UIUtils.showLoadingMessage('正在加載題目...');
            
            const loadSuccess = await window.AppUtils.DataLoader.loadPracticesData();
            window.AppUtils.UIUtils.hideLoadingMessage();
            
            if (!loadSuccess) {
                window.AppUtils.UIUtils.showErrorMessage('題目加載失败，使用默認題目');
            }
        }
        
        window.AppState.isChallengeMode = true;
        
        // 隐藏主界面，显示挑战界面
        this.toggleChallengeUI(true);
        
        // 初始化挑战状态
        this.initializeChallenge();
    }

    /**
     * 退出挑战模式
     */
    static exitChallenge() {
        window.AppState.isChallengeMode = false;
        
        // 显示主界面，隐藏挑战界面
        this.toggleChallengeUI(false);
        
        // 恢复所有按钮的显示
        document.querySelectorAll('.shape-btn, .relationship-diagram-btn').forEach(btn => {
            btn.style.display = 'block';
        });
        
        // 恢复挑战按钮状态
        const challengeBtn = document.getElementById('challenge-btn');
        challengeBtn.classList.remove('active');
        challengeBtn.textContent = '🎯 知識挑戰';
        
        // 显示当前选中的形状
        window.RelationshipModule.hideRelationshipDiagram();
        if (window.App && typeof window.App.handleShapeSelection === 'function') {
            window.App.handleShapeSelection(window.AppState.currentShape);
        }
    }

    /**
     * 切换挑战UI显示
     */
    static toggleChallengeUI(showChallenge) {
        const animationContainer = document.querySelector('.animation-container');
        const challengeContainer = document.querySelector('.challenge-container');
        const challengeResultContainer = document.querySelector('.challenge-result-container');
        
        if (showChallenge) {
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
        } else {
            animationContainer.style.display = 'block';
            challengeContainer.style.display = 'none';
            challengeResultContainer.style.display = 'none';
        }
    }

    /**
     * 初始化挑战
     */
    static initializeChallenge() {
        // 开始新挑战，更新进度
        const progress = window.AppUtils.ProgressManager.startChallenge();
        
        // 检查是否完成所有挑战
        if (window.AppUtils.ProgressManager.isAllCompleted()) {
            this.showCompletionMessage();
            return;
        }
        
        // 智能选择题目
        const selectedQuestions = window.AppUtils.QuestionSelector.selectQuestionsForChallenge();
        
        // 如果没有选到题目（极端情况），显示完成消息
        if (selectedQuestions.length === 0) {
            this.showCompletionMessage();
            return;
        }
        
        // 重置挑战状态
        window.AppState.challengeState = {
            questions: selectedQuestions,
            currentQuestionIndex: 0,
            score: 0,
            wrongQuestions: [],
            totalQuestions: selectedQuestions.length,
            isAnswered: false
        };
        
        // 确保图形区域被隐藏
        this.hideShapeDisplay();
        
        // 更新UI
        this.updateChallengeProgress();
        this.displayCurrentQuestion();
    }

    /**
     * 隐藏形状显示区域
     */
    static hideShapeDisplay() {
        const shapeDisplay = document.querySelector('.question-shape-display');
        const questionArea = document.querySelector('.question-area');
        shapeDisplay.classList.add('hidden');
        questionArea.classList.add('shape-hidden');
    }

    /**
     * 显示完成消息
     */
    static showCompletionMessage() {
        const totalQuestions = window.AppUtils.DataLoader.getTotalQuestionCount();
        const challengeContainer = document.querySelector('.challenge-container');
        challengeContainer.innerHTML = `
            <div class="completion-container">
                <div class="completion-icon">🎉</div>
                <h2>挑戰完成！</h2>
                <p class="completion-description">
                    恭喜你已經完成所有${totalQuestions}道題目的挑戰！<br>
                    你對四邊形的知識掌握得非常好！
                </p>
                <div class="master-badge">
                    大師級別 🏆
                </div>
                <div class="completion-actions">
                    <button class="completion-btn" onclick="window.AppUtils.ProgressManager.resetProgress(); window.ChallengeModule.initializeChallenge();">
                        🔄 重新開始所有挑戰
                    </button>
                    <button class="completion-btn home-btn" onclick="window.ChallengeModule.exitChallenge();">
                        🏠 返回學習
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 更新挑战进度显示
     */
    static updateChallengeProgress() {
        const questionCounter = document.getElementById('question-counter');
        const correctCount = document.getElementById('correct-count');
        const wrongCount = document.getElementById('wrong-count');
        
        questionCounter.textContent = `第 ${window.AppState.challengeState.currentQuestionIndex + 1} 題 / ${window.AppState.challengeState.totalQuestions} 題`;
        correctCount.textContent = window.AppState.challengeState.score;
        wrongCount.textContent = window.AppState.challengeState.wrongQuestions.length;
    }

    /**
     * 显示当前题目
     */
    static displayCurrentQuestion() {
        const question = window.AppState.challengeState.questions[window.AppState.challengeState.currentQuestionIndex];
        if (!question) {
            this.showChallengeResult();
            return;
        }
        
        // 更新题目显示
        const questionText = document.getElementById('current-question');
        const shapeTitle = document.getElementById('challenge-shape-title');
        const answerFeedback = document.querySelector('.answer-feedback');
        const answerButtons = document.querySelectorAll('.answer-btn');
        
        questionText.textContent = question.question;
        shapeTitle.textContent = window.AppData.SHAPES_DATA[question.shape].title;
        answerFeedback.style.display = 'none';
        
        // 重置答题按钮
        answerButtons.forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
        
        window.AppState.challengeState.isAnswered = false;
        
        // 确保图形完全隐藏
        this.hideShapeDisplay();
        
        // 预先准备形状，但不显示
        this.displayChallengeShape(question.shape);
        
        // 清除所有视觉高亮
        document.querySelectorAll('#challenge-shape-svg .visual-element').forEach(el => {
            el.classList.remove('highlight');
        });
    }

    /**
     * 显示挑战模式的形状
     */
    static displayChallengeShape(shapeName) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
        if (!shape) return;
        
        const polygon = document.getElementById('challenge-main-shape');
        polygon.setAttribute('points', shape.points);
        
        // 更新视觉标记（挑战模式）
        this.updateChallengeVisualMarkers(shapeName);
    }

    /**
     * 更新挑战模式的视觉标记
     */
    static updateChallengeVisualMarkers(shapeName) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
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

        // 设置各种标记（简化版本，复用主要逻辑）
        this.setChallengeParallelMarkers(shapeName, points);
        this.setChallengeAngleMarkers(shapeName, points);
        this.setChallengeEqualMarkers(shapeName, points);
        this.setChallengeDiagonalMarkers(shapeName, points);
    }

    /**
     * 设置挑战模式平行线标记
     */
    static setChallengeParallelMarkers(shapeName, points) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
        if (!shape.visualElements.parallel?.show) return;

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

    /**
     * 设置挑战模式角度标记
     */
    static setChallengeAngleMarkers(shapeName, points) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
        
        // 设置直角标记
        if (shape.visualElements.rightAngle?.show) {
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
        if (shape.visualElements.generalAngle?.show) {
            const angleMarksGeneral = document.getElementById('challenge-angle-marks-general');
            angleMarksGeneral.style.display = 'block';
            
            if (shapeName === 'rhombus') {
                this.setChallengeRhombusAngleMarkers(points);
            } else if (shapeName === 'parallelogram') {
                this.setChallengeParallelogramAngleMarkers(points);
            }
        }
    }

    /**
     * 设置挑战模式菱形角度标记
     */
    static setChallengeRhombusAngleMarkers(points) {
        const dot1 = document.getElementById('challenge-angle-dot1');
        const dot3 = document.getElementById('challenge-angle-dot3');
        if (dot1 && dot3) {
            dot1.setAttribute('cx', points[0].x);
            dot1.setAttribute('cy', points[0].y);
            dot1.setAttribute('r', '3');
            
            dot3.setAttribute('cx', points[2].x);
            dot3.setAttribute('cy', points[2].y);
            dot3.setAttribute('r', '3');
        }
        
        const dot2 = document.getElementById('challenge-angle-dot2');
        const dot4 = document.getElementById('challenge-angle-dot4');
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
     * 设置挑战模式平行四边形角度标记
     */
    static setChallengeParallelogramAngleMarkers(points) {
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

    /**
     * 设置挑战模式相等边标记
     */
    static setChallengeEqualMarkers(shapeName, points) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
        if (!shape.visualElements.equal?.show) return;

        const equalMarks = document.getElementById('challenge-equal-marks');
        equalMarks.style.display = 'block';
        
        // 这里可以添加相等边标记的具体实现
        // 为了简化，目前只显示标记容器
    }

    /**
     * 设置挑战模式对角线标记
     */
    static setChallengeDiagonalMarkers(shapeName, points) {
        const shape = window.AppData.SHAPES_DATA[shapeName];
        if (!shape.visualElements.diagonal?.show) return;

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

    /**
     * 高亮挑战模式的视觉元素
     */
    static highlightChallengeVisualElement(visualType) {
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
     * 处理答题
     */
    static handleAnswer(selectedAnswer) {
        if (window.AppState.challengeState.isAnswered) return;
        
        window.AppState.challengeState.isAnswered = true;
        const question = window.AppState.challengeState.questions[window.AppState.challengeState.currentQuestionIndex];
        const isCorrect = selectedAnswer === question.answer;
        
        // 禁用答题按钮
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.6';
        });
        
        // 记录答题结果到Cookie
        window.AppUtils.ProgressManager.recordAnswer(question.id, isCorrect);
        
        // 更新分数和错题记录
        if (isCorrect) {
            window.AppState.challengeState.score++;
            this.showCorrectFeedback();
        } else {
            window.AppState.challengeState.wrongQuestions.push({
                question: question,
                userAnswer: selectedAnswer,
                correctAnswer: question.answer,
                questionIndex: window.AppState.challengeState.currentQuestionIndex
            });
            this.showWrongFeedback(question);
        }
        
        // 更新进度显示
        this.updateChallengeProgress();
    }

    /**
     * 显示答对的反馈
     */
    static showCorrectFeedback() {
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
            if (window.AppState.challengeState.currentQuestionIndex < window.AppState.challengeState.totalQuestions - 1) {
                this.nextQuestion();
            } else {
                this.showChallengeResult();
            }
        }, 1200);
    }

    /**
     * 显示答错的反馈
     */
    static showWrongFeedback(question) {
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
                this.highlightChallengeVisualElement(question.property);
            }, 300);
        }
        
        // 设置下一题按钮
        if (window.AppState.challengeState.currentQuestionIndex < window.AppState.challengeState.totalQuestions - 1) {
            nextBtn.textContent = '理解了，下一題 →';
            nextBtn.onclick = () => this.nextQuestion();
        } else {
            nextBtn.textContent = '查看最終結果 →';
            nextBtn.onclick = () => this.showChallengeResult();
        }
    }

    /**
     * 下一题
     */
    static nextQuestion() {
        window.AppState.challengeState.currentQuestionIndex++;
        
        // 确保重新隐藏图形区域
        this.hideShapeDisplay();
        
        this.displayCurrentQuestion();
    }

    /**
     * 显示挑战结果
     */
    static showChallengeResult() {
        const challengeContainer = document.querySelector('.challenge-container');
        const challengeResultContainer = document.querySelector('.challenge-result-container');
        
        challengeContainer.style.display = 'none';
        challengeResultContainer.style.display = 'block';
        
        // 更新结果显示
        this.updateResultDisplay();
    }

    /**
     * 更新结果显示
     */
    static updateResultDisplay() {
        const finalScoreText = document.getElementById('final-score-text');
        const accuracyRate = document.getElementById('accuracy-rate');
        const correctTotal = document.getElementById('correct-total');
        const wrongTotal = document.getElementById('wrong-total');
        const wrongQuestionsReview = document.getElementById('wrong-questions-review');
        const wrongQuestionsList = document.getElementById('wrong-questions-list');
        const knowledgePointsSummary = document.getElementById('knowledge-points-summary');
        const knowledgePointsList = document.getElementById('knowledge-points-list');
        
        // 获取总体进度
        const progress = window.AppUtils.ProgressManager.getProgress();
        const totalQuestions = window.AppUtils.DataLoader.getTotalQuestionCount();
        
        // 基本统计
        const accuracy = Math.round((window.AppState.challengeState.score / window.AppState.challengeState.totalQuestions) * 100);
        finalScoreText.textContent = `${window.AppState.challengeState.score}/${window.AppState.challengeState.totalQuestions}`;
        accuracyRate.textContent = `${accuracy}%`;
        correctTotal.textContent = window.AppState.challengeState.score;
        wrongTotal.textContent = window.AppState.challengeState.wrongQuestions.length;
        
        // 调整分数圆圈颜色
        this.adjustScoreCircleColor(accuracy);
        
        // 添加总体进度信息
        this.addOverallProgressInfo(progress, totalQuestions);
        
        // 错题复习
        this.setupWrongQuestionsReview(wrongQuestionsReview, wrongQuestionsList);
        
        // 知识点总结
        this.setupKnowledgePointsSummary(knowledgePointsSummary, knowledgePointsList);
    }

    /**
     * 调整分数圆圈颜色
     */
    static adjustScoreCircleColor(accuracy) {
        const scoreCircle = document.querySelector('.score-circle');
        if (accuracy >= 80) {
            scoreCircle.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        } else if (accuracy >= 60) {
            scoreCircle.style.background = 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
        } else {
            scoreCircle.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
        }
    }

    /**
     * 添加总体进度信息
     */
    static addOverallProgressInfo(progress, totalQuestions) {
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
    }

    /**
     * 设置错题复习
     */
    static setupWrongQuestionsReview(wrongQuestionsReview, wrongQuestionsList) {
        if (window.AppState.challengeState.wrongQuestions.length > 0) {
            wrongQuestionsReview.style.display = 'block';
            wrongQuestionsList.innerHTML = '';
            
            window.AppState.challengeState.wrongQuestions.forEach((wrongQ, index) => {
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
        } else {
            wrongQuestionsReview.style.display = 'none';
        }
    }

    /**
     * 设置知识点总结
     */
    static setupKnowledgePointsSummary(knowledgePointsSummary, knowledgePointsList) {
        const knowledgePoints = {};
        window.AppState.challengeState.wrongQuestions.forEach(wrongQ => {
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
                    if (window.AppData.PROPERTY_CATEGORIES[category]) {
                        categoryName = window.AppData.PROPERTY_CATEGORIES[category].name;
                    }
                    
                    pointItem.innerHTML = `
                        <div class="knowledge-point-category">${point}</div>
                        <div class="knowledge-point-details">建議複習 ${categoryName} 相關知識</div>
                    `;
                    knowledgePointsList.appendChild(pointItem);
                });
            });
        } else {
            knowledgePointsSummary.style.display = 'none';
        }
    }

    /**
     * 重新开始挑战
     */
    static restartChallenge() {
        this.initializeChallenge();
        const challengeContainer = document.querySelector('.challenge-container');
        const challengeResultContainer = document.querySelector('.challenge-result-container');
        challengeContainer.style.display = 'block';
        challengeResultContainer.style.display = 'none';
    }

    /**
     * 显示重置确认对话框
     */
    static showResetConfirmationDialog() {
        const progress = window.AppUtils.ProgressManager.getProgress();
        const totalQuestions = window.AppUtils.DataLoader.getTotalQuestionCount();
        
        const overlay = document.createElement('div');
        overlay.className = 'reset-confirmation-overlay';
        overlay.innerHTML = `
            <div class="reset-confirmation-dialog">
                <h3>⚠️ 確認重置進度</h3>
                <p>
                    您確定要清除所有答題記錄嗎？<br>
                    <strong>目前進度：</strong><br>
                    • 已完成題目：${progress.correctQuestions.length}/${totalQuestions}<br>
                    • 挑戰次數：${progress.challengeCount}<br>
                    • 需要復習：${progress.wrongQuestions.length} 題
                </p>
                <p style="color: #ff6b6b; font-weight: bold;">
                    此操作無法撤銷！
                </p>
                <div class="reset-confirmation-buttons">
                    <button class="reset-cancel-btn">❌ 取消</button>
                    <button class="reset-confirm-btn">🔄 確認重置</button>
                </div>
            </div>
        `;
        
        // 添加事件监听器
        const cancelBtn = overlay.querySelector('.reset-cancel-btn');
        const confirmBtn = overlay.querySelector('.reset-confirm-btn');
        
        cancelBtn.addEventListener('click', () => {
            this.hideResetConfirmationDialog(overlay);
        });
        
        confirmBtn.addEventListener('click', () => {
            this.executeProgressReset();
            this.hideResetConfirmationDialog(overlay);
        });
        
        // 点击遮罩层关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideResetConfirmationDialog(overlay);
            }
        });
        
        document.body.appendChild(overlay);
    }

    /**
     * 隐藏重置确认对话框
     */
    static hideResetConfirmationDialog(overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        }, 300);
    }

    /**
     * 执行进度重置
     */
    static executeProgressReset() {
        // 重置进度数据
        window.AppUtils.ProgressManager.resetProgress();
        
        // 显示重置成功提示
        this.showResetSuccessMessage();
        
        // 重新初始化挑战
        setTimeout(() => {
            this.initializeChallenge();
        }, 1500);
    }

    /**
     * 显示重置成功消息
     */
    static showResetSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 18px;
            font-weight: bold;
            z-index: 2000;
            box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
            animation: successPulse 1.5s ease;
            text-align: center;
        `;
        successMessage.innerHTML = `
            ✅ 進度重置成功！<br>
            <span style="font-size: 14px; opacity: 0.9;">正在重新開始挑戰...</span>
        `;
        
        document.body.appendChild(successMessage);
        
        // 1.5秒后移除消息
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                successMessage.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(successMessage)) {
                        document.body.removeChild(successMessage);
                    }
                }, 300);
            }
        }, 1500);
    }
}

// 挂载到全局对象
window.ChallengeModule = ChallengeModule;