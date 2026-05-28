import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import authStyles from '../styles/auth';

// --- API CONFIGURATION ---
// FIXED: Removed the /auth prefix based on your index.js!
import { BASE_URL } from "../config";

const API_URL = `${BASE_URL}/register`; 

export default function SignUp({ onSignUp, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    Keyboard.dismiss(); 
    setErrorMessage('');

    if (!name || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: name,
          email: email,
          password: password
        })
      });

      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.log("Raw Server Response:", textResponse);
        setErrorMessage("Server error (Returned HTML). Are you on Wi-Fi? Is the endpoint correct?");
        return;
      }

      if (response.ok) {
        Alert.alert(
          "Registration Successful", 
          "Your account has been created in the database. Please proceed to log in.",
          [{ text: "OK", onPress: () => onSwitchToLogin() }]
        );
      } else {
        setErrorMessage(data.message || "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error. Please check your backend connection and Wi-Fi.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={authStyles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={authStyles.logoContainer}>
            <Image 
              source={require('../assets/logos/SarakWay-logo.png')} 
              style={authStyles.logoImage} 
              resizeMode="contain" 
            />
            <Text style={authStyles.title}>Create Account</Text>
            <Text style={authStyles.subtitle}>Join the SarakWay Training Program</Text>
          </View>

          <View style={authStyles.formContainer}>
            
            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Username</Text>
              <TextInput 
                style={authStyles.input} 
                placeholder="Enter your Username"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Email Address</Text>
              <TextInput 
                style={authStyles.input} 
                placeholder="Enter your email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={authStyles.inputGroup}>
              <Text style={authStyles.label}>Password</Text>
              <TextInput 
                style={authStyles.input} 
                placeholder="Create a password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={authStyles.primaryButton} onPress={handleRegister}>
              <Text style={authStyles.primaryButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={authStyles.switchContainer}>
              <Text style={authStyles.switchText}>Already have an account?</Text>
              <TouchableOpacity onPress={onSwitchToLogin}>
                <Text style={authStyles.switchLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {errorMessage !== '' && (
              <Text style={authStyles.errorText}>{errorMessage}</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
