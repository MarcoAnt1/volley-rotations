<template>
  <nav class="topbar">
    <RouterLink to="/" class="brand">Learn volleyball</RouterLink>
  </nav>

  <main class="page">
    <RouterView />
  </main>
</template>

<style scoped>
.topbar {
  max-width: 560px;
  margin: 0 auto;
  padding: 16px 16px 0;
}

.brand {
  font-size: 15px;
  font-weight: 700;
  color: var(--ink);
  text-decoration: none;
}

.brand:hover {
  color: var(--accent);
}

.page {
  max-width: 560px;
  margin: 0 auto;
  padding: 32px 16px 64px;
  text-align: center;
}
</style>