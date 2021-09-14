<template>
  <div>
    <slot name="header">
      <div class="v-header"
        style="height: 70px;display: flex;align-items: center;padding-left:20px;overflow: hidden;padding:0 -12px;">
        <div style="display:inline-block;color:#17233d;font-weight:500;font-size:20px;">页面标题</div>
      </div>
    </slot>
    <slot></slot>
    <slot name="footer">
      <div class="footer container">
        <div class="copyright">
          <p>© 2018 - tongbaochun.com <a href="http://beian.miit.gov.cn/" target="_blank"
              class="link-normal">闽ICP备16031510号</a>
          </p>
        </div>
      </div>
    </slot>
  </div>
</template>
<script>
  export default {
  }
</script>