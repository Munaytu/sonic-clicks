<template>
  <div>
    <h1>Click Here!</h1>
    <button id="clickButton">Click</button>
    <p>Total Clicks: <span id="clickCount">0</span></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clicks: 0
    };
  },
  mounted() {
    const button = document.getElementById('clickButton');
    const clickCount = document.getElementById('clickCount');

    button.addEventListener('click', () => {
      this.clicks++;
      clickCount.textContent = this.clicks;
      // TODO: Send click data to backend API
    });
  }
};
</script>

<style>
/* Add some basic styling here */
#clickButton {
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
}
</style>