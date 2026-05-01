<?php
session_start();
session_unset();//clear all session variables
session_destroy();//destroy the session
?>
<script>
  localStorage.removeItem('cart');
  window.location.href = 'main.html';
</script>