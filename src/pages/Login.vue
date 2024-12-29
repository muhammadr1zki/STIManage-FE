<template>
  <v-app>
    <v-container
      class="d-flex align-center justify-center fill-height"
      style="height: 100vh; background-color: #f2f2f2"
    >
      <v-row align="center" justify="center" class="fill-height">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="2" style="border-radius: 12px; overflow: hidden">
            <v-row no-gutters>
              <!-- Kolom Kiri: Gambar -->
              <v-col cols="12" md="6" class="d-flex justify-center align-center" style="background-color: #f4f8ff; padding: 12px"
              >
                <v-img src="@/assets/image.svg" max-width="250" max-height="250" contain alt="STImanage logo"
                />
              </v-col>

              <!-- Kolom Kanan: Form Login -->
              <v-col cols="12" md="6" class="px-8 py-6">
                <h2 class="text-h5 font-weight-bold text-center mb-4">
                  Login to Your Account
                </h2>
                <p class="text-center mb-6 text-body-2">
                  Hello Team! Let's see your work progress now
                </p>

                <v-form @submit.prevent="handleLogin">
                  <!-- Username Field -->
                  <v-text-field v-model="form.username" label="Username" outlined dense class="mb-3" :error-messages="errors.username" @input="clearError('username')" required
                  />

                  <!-- Password Field -->
                  <v-text-field v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password" outlined dense class="mb-3" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="togglePasswordVisibility" :error-messages="errors.password" @input="clearError('password')" required
                  />

                  <!-- Submit Button -->
                  <v-btn type="submit" color="primary" block large>
                    Login
                  </v-btn>
                </v-form>

                <!-- Error Message -->
                <v-alert v-if="errorMessage" type="error" dense class="mt-4">
                  {{ errorMessage }}
                </v-alert>

                <!-- Registration Redirect -->
                <div class="text-center mt-4">
                  <p class="text-body-2">
                    Don't have an account?
                    <span class="clickable-text" @click="redirectToRegister">
                      Register here
                    </span>
                  </p>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";

// Reactive state
const form = ref({ username: "", password: "" });
const errors = ref({});
const errorMessage = ref("");
const showPassword = ref(false);

// Validation Logic
const validateForm = () => {
  errors.value = {};

  // Validate Username
  if (!form.value.username) {
    errors.value.username = "Username wajib diisi";
  }

  // Validate Password
  if (!form.value.password) {
    errors.value.password = "Password wajib diisi";
  }

  return Object.keys(errors.value).length === 0;
};

// Handle login process
const handleLogin = async () => {
  errorMessage.value = "";

  // Validate Form before submission
  if (!validateForm()) return;

  const loginEndpoint = "http://localhost:3000/api/v1/login";

  try {
    const response = await fetch(loginEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Kredensial tidak valid. Silahkan coba lagi.");
    }

    const data = await response.json();
    const token = data.data.access_token;
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    const expiresAt = decodedToken.exp * 1000;

    // Store token and expiration time
    localStorage.setItem("token", token);
    localStorage.setItem("expires_at", new Date(expiresAt).toISOString());

    router.push("/JobManagement"); // Navigate to JobManagement page
  } catch (error) {
    errorMessage.value = error.message || "Terjadi Error. Silahkan coba lagi.";
  }
};

// Clear error messages for a specific field
const clearError = (field) => {
  errors.value[field] = null;
};

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Redirect to register page
const redirectToRegister = () => router.push("/register");
</script>

<style scoped>
html,
body,
.v-application {
  height: 100%;
  background-color: #f2f2f2 !important;
}

.clickable-text {
  color: #1976d2;
  cursor: pointer;
  text-decoration: underline;
}

.clickable-text:hover {
  text-decoration: none;
}
</style>
