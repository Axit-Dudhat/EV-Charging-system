<template>
  
  <div class="login-container">
    <div class="login-card">
      <h1>EV Charging System</h1>
      <h3>Login</h3>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input
            type="email"
            v-model="email"
            placeholder="Enter Email"
            required
          />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            placeholder="Enter Password"
            required
          />
        </div>

        <p class="error" v-if="error">{{ error }}</p>

        <button class="btn-login" type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Login" }}
        </button>

      </form>
      <br>
      <p class="login-link">Don't have an account? 
  <router-link to="/register">
    Register
  </router-link>
</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginuser } from "../services/authService";
import { store } from "../store";

const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  error.value = "";
  loading.value = true;

  try {
    const response = await loginuser({
      email: email.value,
      password: password.value,
    });

    // Populate auth storage keys for both Axios interceptor and Store reactive state
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("ev_token", response.data.token);
    
    const adminUser = { name: "Administrator", role: "Grid Manager" };
    localStorage.setItem("ev_user", JSON.stringify(adminUser));

    // Update store state dynamically
    store.apiToken = response.data.token;
    store.currentUser = adminUser;
    store.currentPage = "stations";

    alert("Login Successful");
    router.push("/dashboard");
  } catch (err) {
    error.value =
      err.response?.data?.message || "Invalid Email or Password";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fb;
}

.login-card {
  width: 400px;
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.login-card h1 {
  text-align: center;
  margin-bottom: 10px;
  color: #2563eb;
}

.login-card h3 {
  text-align: center;
  margin-bottom: 30px;
  color: #555;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

label {
  margin-bottom: 8px;
  font-weight: bold;
}

input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  font-size: 15px;
}

input:focus {
  border-color: #2563eb;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-login:hover {
  background: #1d4ed8;
}

.error {
  color: red;
  margin-bottom: 15px;
  font-size: 14px;
  text-align: center;
}
.login-link{
    margin-top:20px;
    text-align:center;
    }

    .login-link a{
    text-decoration:none;
    color:#2563eb;
    font-weight:bold;
    }
</style>
