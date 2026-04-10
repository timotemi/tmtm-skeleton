<template>
  <div class="spending-chatbot-page">
    <div ref="chatbotCardRef" class="chatbot-card">
      <div v-if="gptLoading" class="loading-overlay">
        <div class="loading-box">
          <div class="loading-spinner"></div>
          <p>AI가 이번 달 소비패턴을 분석하고 있어요...</p>
        </div>
      </div>

      <div class="chatbot-header">
        <div class="header-badge">AI DASHBOARD</div>
        <h2>이번 달 소비패턴 분석 챗봇</h2>
        <p>
          이번 달 거래내역을 바탕으로 소비 성향을 분석하고 맞춤 조언까지 드려요.
        </p>
      </div>

      <div class="summary-grid" v-if="analysis">
        <div class="summary-box income-box">
          <span class="summary-icon">💰</span>
          <span class="summary-label">총 수입</span>
          <strong>{{ formatMoney(analysis.totalIncome) }}원</strong>
        </div>

        <div class="summary-box expense-box">
          <span class="summary-icon">💸</span>
          <span class="summary-label">총 지출</span>
          <strong>{{ formatMoney(analysis.totalExpense) }}원</strong>
        </div>

        <div class="summary-box profit-box">
          <span class="summary-icon">📈</span>
          <span class="summary-label">순수익</span>
          <strong>{{ formatMoney(analysis.netProfit) }}원</strong>
        </div>

        <div class="summary-box top-box">
          <span class="summary-icon">🏷️</span>
          <span class="summary-label">최대 지출 카테고리</span>
          <strong>{{ analysis.topExpenseCategory }}</strong>
        </div>
      </div>

      <div class="button-group">
        <button
          class="action-button secondary"
          @click="loadTransactions"
          :disabled="loading || gptLoading || chatLoading"
        >
          <span class="btn-icon">📂</span>
          {{ loading ? '불러오는 중...' : '이번 달 거래내역 불러오기' }}
        </button>

        <button
          class="action-button primary"
          @click="generateGptAnalysis"
          :disabled="loading || gptLoading || chatLoading"
        >
          <span class="btn-icon">✨</span>
          {{ gptLoading ? 'GPT 분석 중...' : 'GPT 소비패턴 분석하기' }}
        </button>
      </div>

      <div v-if="errorMessage" class="error-box">
        {{ errorMessage }}
      </div>

      <div
        class="dashboard-section"
        v-if="analysis && analysis.sortedExpenseCategories.length > 0"
      >
        <div class="dashboard-chart-card">
          <div class="section-title-row">
            <h3>소비 분포 도넛 차트</h3>
            <span class="section-chip">AI VIEW</span>
          </div>

          <div class="donut-layout">
            <div class="donut-wrap">
              <div class="donut-chart" :style="donutChartStyle">
                <div class="donut-hole">
                  <span class="donut-center-label">총 지출</span>
                  <strong>{{ formatMoney(analysis.totalExpense) }}원</strong>
                </div>
              </div>
            </div>

            <div class="donut-legend">
              <div
                v-for="(item, index) in chartItems"
                :key="item.category"
                class="legend-item"
              >
                <div class="legend-left">
                  <span
                    class="legend-color"
                    :style="{
                      background: chartColors[index % chartColors.length],
                    }"
                  ></span>
                  <span class="legend-icon">{{
                    getCategoryIcon(item.category)
                  }}</span>
                  <span class="legend-category">{{ item.category }}</span>
                </div>

                <div class="legend-right">
                  <span class="legend-ratio">{{ item.ratio }}%</span>
                  <span class="legend-amount"
                    >{{ formatMoney(item.amount) }}원</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="dashboard-detail-card">
          <div class="section-title-row">
            <h3>카테고리별 지출 상세</h3>
            <span class="section-chip subtle">DETAIL</span>
          </div>

          <div
            v-for="(item, index) in analysis.sortedExpenseCategories"
            :key="item.category"
            class="category-row"
          >
            <div class="category-title">
              <div class="category-title-left">
                <span class="category-icon">{{
                  getCategoryIcon(item.category)
                }}</span>
                <span>{{ item.category }}</span>
              </div>
              <span>{{ item.ratio }}%</span>
            </div>

            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{
                  width: `${item.ratio}%`,
                  background: chartColors[index % chartColors.length],
                }"
              ></div>
            </div>

            <div class="category-amount">{{ formatMoney(item.amount) }}원</div>
          </div>
        </div>
      </div>

      <div class="result-box" v-if="ruleBasedMessage">
        <h3>📌 기본 분석 결과</h3>
        <p>{{ ruleBasedMessage }}</p>
      </div>

      <div class="result-box gpt-box" v-if="gptMessage">
        <h3>🤖 GPT 분석 결과</h3>
        <p>{{ gptMessage }}</p>
      </div>

      <div
        ref="consultingSectionRef"
        class="consulting-section"
        v-if="gptMessage"
      >
        <div class="consulting-header">
          <h3>AI 소비 상담 채팅</h3>
          <p>분석 결과를 바탕으로 자유롭게 질문해보세요.</p>
        </div>

        <div
          ref="chatMessagesRef"
          class="chat-messages"
          v-if="chatMessages.length > 0"
        >
          <div
            v-for="(message, index) in chatMessages"
            :key="index"
            :class="[
              'chat-row',
              message.role === 'user' ? 'chat-row-user' : 'chat-row-ai',
            ]"
          >
            <div
              v-if="message.role === 'assistant'"
              class="chat-avatar ai-avatar"
            >
              AI
            </div>

            <div
              :class="[
                'chat-bubble',
                message.role === 'user' ? 'user-bubble' : 'ai-bubble',
              ]"
            >
              <div class="chat-text">
                {{ message.text }}
              </div>
            </div>
          </div>
        </div>

        <div class="chat-empty" v-else>궁금한 내용을 바로 입력해보세요.</div>

        <div class="chat-input-wrap">
          <textarea
            v-model="userQuestion"
            class="chat-input"
            rows="3"
            placeholder="예: 식비를 줄이려면 어떤 습관부터 바꾸면 좋을까?"
            :disabled="chatLoading"
            @keydown.enter.exact.prevent="sendChat"
          ></textarea>

          <button
            class="action-button primary chat-send-button"
            @click="sendChat"
            :disabled="chatLoading"
          >
            <span class="btn-icon">🚀</span>
            {{ chatLoading ? '답변 생성 중...' : '질문 보내기' }}
          </button>
        </div>
      </div>

      <div ref="bottomAnchorRef" class="bottom-anchor"></div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/styles/chatbot.css';
import axios from 'axios';
import { ref, computed, nextTick } from 'vue';
import { analyzeTransactions, formatMoney } from '@/utils/transactionAnalysis';
import { requestSpendingAnalysis, requestSpendingChat } from '@/api/chatbot';

const transactions = ref([]);
const analysis = ref(null);
const loading = ref(false);
const gptLoading = ref(false);
const chatLoading = ref(false);
const errorMessage = ref('');
const gptMessage = ref('');
const ruleBasedMessage = ref('');
const userQuestion = ref('');
const chatMessages = ref([]);

const chatbotCardRef = ref(null);
const consultingSectionRef = ref(null);
const bottomAnchorRef = ref(null);
const chatMessagesRef = ref(null);

const chartColors = [
  'linear-gradient(135deg, #06b6d4, #2563eb)',
  'linear-gradient(135deg, #8b5cf6, #6366f1)',
  'linear-gradient(135deg, #22c55e, #10b981)',
  'linear-gradient(135deg, #f59e0b, #f97316)',
  'linear-gradient(135deg, #ec4899, #d946ef)',
  'linear-gradient(135deg, #ef4444, #f97316)',
];

const getLoginUserId = () => {
  try {
    const loginUser = JSON.parse(localStorage.getItem('loginUser'));
    return loginUser?.id ?? null;
  } catch {
    return null;
  }
};

const chartItems = computed(() => {
  if (!analysis.value?.sortedExpenseCategories?.length) return [];
  return analysis.value.sortedExpenseCategories.slice(0, 6);
});

const donutChartStyle = computed(() => {
  if (!chartItems.value.length) {
    return {
      background: 'conic-gradient(#e5e7eb 0deg 360deg)',
    };
  }

  let start = 0;
  const segments = chartItems.value.map((item, index) => {
    const degree = (item.ratio / 100) * 360;
    const end = start + degree;
    const color = getPlainColor(index);
    const segment = `${color} ${start}deg ${end}deg`;
    start = end;
    return segment;
  });

  if (start < 360) {
    segments.push(`#e5e7eb ${start}deg 360deg`);
  }

  return {
    background: `conic-gradient(${segments.join(', ')})`,
  };
});

const getPlainColor = (index) => {
  const colors = [
    '#2563eb',
    '#7c3aed',
    '#10b981',
    '#f59e0b',
    '#ec4899',
    '#ef4444',
  ];
  return colors[index % colors.length];
};

const getCategoryIcon = (category) => {
  const iconMap = {
    식비: '🍽️',
    카페: '☕',
    교통: '🚌',
    쇼핑: '🛍️',
    문화: '🎬',
    여가: '🎮',
    통신: '📱',
    주거: '🏠',
    의료: '💊',
    교육: '📚',
    급여: '💼',
    월급: '💼',
    기타: '📦',
  };

  return iconMap[category] || '📌';
};

const scrollToCardTop = async () => {
  await nextTick();

  if (chatbotCardRef.value) {
    chatbotCardRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

const scrollToBottom = async () => {
  await nextTick();

  if (bottomAnchorRef.value) {
    bottomAnchorRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }
};

const scrollChatToBottom = async () => {
  await nextTick();

  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight;
  }

  await scrollToBottom();
};

const loadTransactions = async () => {
  loading.value = true;
  errorMessage.value = '';
  gptMessage.value = '';
  ruleBasedMessage.value = '';
  chatMessages.value = [];
  userQuestion.value = '';

  try {
    const response = await axios.get('http://localhost:3000/transactions');
    const allTransactions = response.data || [];

    const loginUserId = getLoginUserId();
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const currentMonthTransactions = allTransactions.filter((transaction) => {
      if (loginUserId !== null && transaction.userId !== loginUserId)
        return false;
      if (!transaction.date) return false;

      const transactionDate = new Date(transaction.date);

      return (
        transactionDate.getFullYear() === currentYear &&
        transactionDate.getMonth() === currentMonth
      );
    });

    transactions.value = currentMonthTransactions;
    analysis.value = analyzeTransactions(currentMonthTransactions);
    ruleBasedMessage.value = makeRuleBasedMessage(analysis.value);

    if (currentMonthTransactions.length === 0) {
      errorMessage.value = '이번 달 거래내역이 없습니다.';
    }
  } catch (error) {
    console.error(error);
    errorMessage.value =
      '거래내역을 불러오지 못했습니다. json-server가 켜져 있는지 확인해주세요.';
  } finally {
    loading.value = false;
  }
};

const generateGptAnalysis = async () => {
  if (!analysis.value || analysis.value.transactionCount === 0) {
    errorMessage.value = '먼저 이번 달 거래내역을 불러와주세요.';
    return;
  }

  await scrollToCardTop();

  gptLoading.value = true;
  errorMessage.value = '';
  gptMessage.value = '';
  chatMessages.value = [];
  userQuestion.value = '';

  try {
    gptMessage.value = await requestSpendingAnalysis(analysis.value, '회원');
  } catch (error) {
    console.error(error);
    errorMessage.value = error.message || 'GPT 분석 중 오류가 발생했습니다.';
  } finally {
    gptLoading.value = false;
    if (gptMessage.value) {
      await scrollToBottom();
    }
  }
};

const sendChat = async () => {
  const question = userQuestion.value.trim();

  if (!gptMessage.value) {
    errorMessage.value = '먼저 GPT 소비패턴 분석을 실행해주세요.';
    return;
  }

  if (!question) {
    errorMessage.value = '질문을 입력해주세요.';
    return;
  }

  chatLoading.value = true;
  errorMessage.value = '';

  chatMessages.value.push({
    role: 'user',
    text: question,
  });

  userQuestion.value = '';
  await scrollChatToBottom();

  try {
    const answer = await requestSpendingChat(
      analysis.value,
      question,
      chatMessages.value,
      '회원',
    );

    chatMessages.value.push({
      role: 'assistant',
      text: answer,
    });

    await scrollChatToBottom();
  } catch (error) {
    console.error(error);
    errorMessage.value =
      error.message || '소비 상담 답변 생성 중 오류가 발생했습니다.';
  } finally {
    chatLoading.value = false;
  }
};

const makeRuleBasedMessage = (data) => {
  if (!data || data.transactionCount === 0) {
    return '이번 달 거래내역이 아직 없습니다.';
  }

  const messages = [];

  if (data.topExpenseCategory !== '없음') {
    messages.push(
      `${data.topExpenseCategory} 지출 비중이 가장 높고, ${data.expenseRatioByCategory[data.topExpenseCategory]}%를 차지하고 있어요.`,
    );
  }

  if (data.expenseRateComparedToIncome >= 80) {
    messages.push('이번 달 총 지출이 총 수입에 비해 다소 높은 편이에요.');
  } else if (data.expenseRateComparedToIncome >= 50) {
    messages.push('이번 달 총 지출은 총 수입 대비 적정 수준으로 보여요.');
  } else {
    messages.push('이번 달 총 지출은 총 수입에 비해 비교적 안정적인 편이에요.');
  }

  if (data.netProfit > 0) {
    messages.push(
      `이번 달 순수익은 ${formatMoney(data.netProfit)}원으로 흑자 상태예요.`,
    );
  } else if (data.netProfit < 0) {
    messages.push(
      `이번 달 순수익은 ${formatMoney(data.netProfit)}원으로 적자 상태예요.`,
    );
  } else {
    messages.push('이번 달 수입과 지출이 거의 비슷한 수준이에요.');
  }

  return messages.join(' ');
};
</script>
