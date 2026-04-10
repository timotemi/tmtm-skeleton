<template>
  <div class="spending-chatbot-page">
    <div class="chatbot-card">
      <div v-if="gptLoading" class="loading-overlay">
        <div class="loading-box">
          <div class="loading-spinner"></div>
          <p>AI가 이번 달 소비패턴을 분석하고 있어요...</p>
        </div>
      </div>

      <div class="chatbot-header">
        <h2>이번 달 소비패턴 분석 챗봇</h2>
        <p>이번 달 거래내역을 바탕으로 소비 성향을 분석해드려요.</p>
      </div>

      <div class="summary-grid" v-if="analysis">
        <div class="summary-box">
          <span class="summary-label">총 수입</span>
          <strong>{{ formatMoney(analysis.totalIncome) }}원</strong>
        </div>
        <div class="summary-box">
          <span class="summary-label">총 지출</span>
          <strong>{{ formatMoney(analysis.totalExpense) }}원</strong>
        </div>
        <div class="summary-box">
          <span class="summary-label">순수익</span>
          <strong>{{ formatMoney(analysis.netProfit) }}원</strong>
        </div>
        <div class="summary-box">
          <span class="summary-label">최대 지출 카테고리</span>
          <strong>{{ analysis.topExpenseCategory }}</strong>
        </div>
      </div>

      <div
        class="category-section"
        v-if="analysis && analysis.sortedExpenseCategories.length > 0"
      >
        <h3>카테고리별 지출 비율</h3>

        <div
          v-for="item in analysis.sortedExpenseCategories"
          :key="item.category"
          class="category-row"
        >
          <div class="category-title">
            <span>{{ item.category }}</span>
            <span>{{ item.ratio }}%</span>
          </div>

          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${item.ratio}%` }"
            ></div>
          </div>

          <div class="category-amount">{{ formatMoney(item.amount) }}원</div>
        </div>
      </div>

      <div class="button-group">
        <button
          class="action-button"
          @click="loadTransactions"
          :disabled="loading || gptLoading || chatLoading"
        >
          {{ loading ? '불러오는 중...' : '이번 달 거래내역 불러오기' }}
        </button>

        <button
          class="action-button primary"
          @click="generateGptAnalysis"
          :disabled="loading || gptLoading || chatLoading"
        >
          {{ gptLoading ? 'GPT 분석 중...' : 'GPT 소비패턴 분석하기' }}
        </button>
      </div>

      <div v-if="errorMessage" class="error-box">
        {{ errorMessage }}
      </div>

      <div class="result-box" v-if="ruleBasedMessage">
        <h3>기본 분석 결과</h3>
        <p>{{ ruleBasedMessage }}</p>
      </div>

      <div class="result-box gpt-box" v-if="gptMessage">
        <h3>GPT 분석 결과</h3>
        <p>{{ gptMessage }}</p>
      </div>

      <div class="consulting-section" v-if="gptMessage">
        <div class="consulting-header">
          <h3>소비 상담 채팅</h3>
          <p>분석 결과를 바탕으로 자유롭게 질문해보세요.</p>
        </div>

        <div class="chat-messages" v-if="chatMessages.length > 0">
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
            placeholder="질문을 입력하세요."
            :disabled="chatLoading"
            @keydown.enter.exact.prevent="sendChat"
          ></textarea>

          <button
            class="action-button primary chat-send-button"
            @click="sendChat"
            :disabled="chatLoading"
          >
            {{ chatLoading ? '답변 생성 중...' : '질문 보내기' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import '@/assets/styles/chatbot.css';
import axios from 'axios';
import { ref } from 'vue';
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

const getLoginUserId = () => {
  try {
    const loginUser = JSON.parse(localStorage.getItem('loginUser'));
    return loginUser?.id ?? null;
  } catch {
    return null;
  }
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
