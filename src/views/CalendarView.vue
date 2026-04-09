<template>
  <div>
    <div style="width: 680px; margin: 0 auto">
      <div style="border: solid 1px black">
        <div>
          <div style="text-align: center; align-content: center">
            <button @click="prevYear">&lt;&lt;</button>
            <button @click="prevMonth">&lt;</button>
            <span @dblclick="goToday" style="cursor: pointer">
              <!-- 2-3. 현재 날짜 보여주기 
              사용자 설정에 보여주기
              년도 표기 2026 [4자리], 26[2자리]
              월 표기 1월, 01월 [1자리, 2자리]
              일 표기 8일 08일 [1자리 , 2자리]
              시간 표기 오전,오후 12시간제 , 24시간제 표기 [12시간제, 24시간제]
          -->
              {{ year }}년-{{ month + 1 }}월-{{ date }}일
              {{ weekDays[day] }}요일
            </span>
            <button @click="nextMonth">&gt;</button>
            <button @click="nextYear">&gt;&gt;</button><br /><br />
          </div>

          <!-- <p>첫 날: {{ firstDay }}, 마지막 날 : {{ lastDate }}</p> -->
          <!-- <p>{{ calendarTable }}</p>a -->
          <div
            style="
              border: solid 2px black;
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              text-align: center;
            "
          >
            <!-- 1-2. 월화수목금토일 화면에 보이기  -->
            <div v-for="day in weekDays" :key="day">
              {{ day }}
            </div>
          </div>
        </div>

        <div>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              border: solid 1px black;
            "
          >
            <div
              v-for="(item, index) in calendarTable"
              :key="index"
              @click="selectDate(item)"
              :style="{
                /* border: '1px solid gray', 5-4 반복되는 div칸에 값 비교후 적용 */
                height: '100px',
                textAlign: 'center',
                boxSizing: 'border-box',
                color: getDayColor(index),
                backgroundColor: isToday(item) ? 'lightyellow' : null,
                border: isSelected(item) ? '2px solid red' : '1px solid gray',
              }"
            >
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. "+"" 버튼 fixed로 고정 시키기 -->
    <button
      style="
        font-size: 25px;
        position: fixed;
        right: 100px;
        top: 200px;
        border-radius: 100px;
      "
      ;
      @click=""
    >
      +
    </button>
    <!-- 상세 모달 -->
    <div
      v-if="isDetailModalOpen"
      style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(2px);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <div
        style="
          width: 500px;
          min-height: 300px;
          background: white;
          color: black;
          border-radius: 10px;
          padding: 20px;
          box-sizing: border-box;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        "
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          "
        >
          <h3>{{ selectedDate.getDate() }}일 상세내역</h3>
          <button @click="isDetailModalOpen = false">닫기</button>
        </div>

        <div>여기에 데이터 들어갈 예정</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const weekDays = ['일', '월', '화', '수', '목', '금', '토']; // 1-1. 월화수목금토일 값 주기

// 2-1 기준 날짜 가져오기
const currentDate = ref(new Date());

/* 
  getFullYear()   // 연도 → 2026 
  getMonth()      // 월 → 0~11 (4월이면 3)
  getDate()       // 일 → 1~31
  getDay()        // 요일 → 0~6 (일~토)
  */

// 2-2 연, 월, 일, 요일  가져오기
const year = computed(() => {
  return currentDate.value.getFullYear();
});
const month = computed(() => {
  return currentDate.value.getMonth();
});
const date = computed(() => {
  return currentDate.value.getDate();
});
const day = computed(() => {
  return currentDate.value.getDay();
});

// 3-1 현재 날짜의 첫 날, 마지막 날 구하기
const firstDay = computed(() => {
  return new Date(year.value, month.value, 1).getDay();
});
const lastDate = computed(() => {
  return new Date(year.value, month.value + 1, 0).getDate();
});

// 3-2 날짜 테이블 만들기 해당 월의 첫날 알아온후 앞의 날짜는 공백으로 처리

const calendarTable = computed(() => {
  const days = [];

  //   3-3 첫 날 기준으로 7일 만들기 (공백 표기하기)
  for (let i = 0; i < firstDay.value; i++) {
    days.push('');
  }

  //   3-4 1일부터 마지막 날짜까지
  for (let i = 1; i <= lastDate.value; i++) {
    days.push(i);
  }
  //     3-5 42칸 배열 만들기
  for (let i = days.length; i < 42; i++) {
    days.push('');
  }
  return days;
});

//   4-1 버튼 기능 추가 달,년 단위 전후로 표기
/*
  const prevYear = () => {
    currentDate.value = new Date(year.value - 1, month.value, 1);
  };

  const prevMonth = () => {
    currentDate.value = new Date(year.value, month.value - 1, 1);
    x``;
  };

  const nextMonth = () => {
    currentDate.value = new Date(year.value, month.value + 1, 1);
  };

  const nextYear = () => {
    currentDate.value = new Date(year.value + 1, month.value, 1);
  };
  */
// 4-2 매월 1일이 아닌 현재 일자로부터 1년, 1달 계산
const prevYear = () => {
  currentDate.value = new Date(year.value - 1, month.value, date.value);
};

const prevMonth = () => {
  currentDate.value = new Date(year.value, month.value - 1, date.value);
};

const nextMonth = () => {
  currentDate.value = new Date(year.value, month.value + 1, date.value);
};

const nextYear = () => {
  currentDate.value = new Date(year.value + 1, month.value, date.value);
};
// 4-3 오늘 날짜로 돌아오기
const goToday = () => {
  currentDate.value = new Date();
};
// 4-4 공휴일 색 구분하기
const getDayColor = (index) => {
  if (index % 7 === 0) return 'red';
  if (index % 7 === 6) return 'blue';
  return 'black';
};
// 5-1. 오늘 날짜 값에 배경주기 42칸에 대한 값 비교 및 갑 가져오기

const isToday = (item) => {
  if (!item) return false;

  const today = new Date();

  return (
    year.value === today.getFullYear() &&
    month.value === today.getMonth() &&
    item === today.getDate()
  );
};

// 5-2. 클릭시 1개 날짜에 빨간 테두리 적용 1개만 적용시키기
// 5-3. 현재 날짜 받기
const selectedDate = ref(new Date());

const isSelected = function (item) {
  if (!item) return false;

  return (
    selectedDate.value.getFullYear() === year.value &&
    selectedDate.value.getMonth() === month.value &&
    selectedDate.value.getDate() === item
  );
};

// 5-3. 날짜 선택시 실행시킬 함수 @cick 클릭시 현재 배열의 시간 (년도 and 월 and 일 ) 일치할때
const selectDate = function (item) {
  if (!item) return;

  selectedDate.value = new Date(year.value, month.value, item);

  // 6-2. 현재 날짜 클릭시 모달 값 true로 변경
  isDetailModalOpen.value = true;
};

// 6-1. 달력 일자에 모달 달기
const isDetailModalOpen = ref(false);
</script>

<style scoped>
.page {
  padding: 24px;
}
</style>
