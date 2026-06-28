    <template>
    <div class="register-container">
        <div class="register-card">
        <h1>EV Charging System</h1>
        <h3>Create Account</h3>

        <form @submit.prevent="handleRegister">

            <div class="form-group">
            <label>Username</label>
            <input
                type="text"
                v-model="username"
                placeholder="Enter Username"
                required
            />
            </div>

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

            <div class="form-group">
            <label>Confirm Password</label>
            <input
                type="password"
                v-model="confirmPassword"
                placeholder="Confirm Password"
                required
            />
            </div>

            <p class="error" v-if="error">
            {{ error }}
            </p>

            <button
            class="btn-register"
            type="submit"
            :disabled="loading"
            >
            {{ loading ? "Creating Account..." : "Register" }}
            </button>

            <p class="login-link">
            Already have an account?

            <router-link to="/">
                Login
            </router-link>
            </p>

        </form>
        </div>
    </div>
    </template>

    <script setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { registerUser } from "../services/authService";

    const router = useRouter();

    const username = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    const error = ref("");
    const loading = ref(false);

    const handleRegister = async () => {
  error.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }
  loading.value = true;
  try {
    console.log("Register button clicked");
    
    const response = await registerUser({
        username: username.value,
        email: email.value,
        password: password.value,
    });
    // console.log("Response:", response);
    alert("Registration Successful");
    router.push("/login");
  } catch (err) {
    console.log("Full Error:", err);
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Registration Failed";
  } finally {
    loading.value = false;
  }
};
    </script>

    <style scoped>

    *{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial,sans-serif;
    }

    .register-container{
    width:100%;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#f5f7fb;
    }

    .register-card{
    width:420px;
    background:#fff;
    padding:40px;
    border-radius:10px;
    box-shadow:0 10px 25px rgba(0,0,0,.15);
    }

    .register-card h1{
    text-align:center;
    margin-bottom:10px;
    color:#2563eb;
    }

    .register-card h3{
    text-align:center;
    margin-bottom:25px;
    color:#555;
    }

    .form-group{
    display:flex;
    flex-direction:column;
    margin-bottom:18px;
    }

    label{
    margin-bottom:6px;
    font-weight:bold;
    }

    input{
    padding:12px;
    border:1px solid #ccc;
    border-radius:6px;
    font-size:15px;
    outline:none;
    }

    input:focus{
    border-color:#2563eb;
    }

    .btn-register{
    width:100%;
    padding:12px;
    border:none;
    background:#2563eb;
    color:white;
    font-size:16px;
    border-radius:6px;
    cursor:pointer;
    transition:.3s;
    }

    .btn-register:hover{
    background:#1d4ed8;
    }

    .error{
    color:red;
    font-size:14px;
    margin-bottom:15px;
    text-align:center;
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