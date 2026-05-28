import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import authStyles from '../styles/auth';

import { BASE_URL } from "../config";

// --- API CONFIGURATION ---
const API_URL = `${BASE_URL}/login`; 

export default function Login({ onLogin, onSwitchToSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async () => {
    Keyboard.dismiss(); 
    setErrorMessage('');
    
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      });
      
      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.log("Raw Server Response (HTML):", textResponse);
        setErrorMessage("Server error (Returned HTML). Are you on Wi-Fi? Is the endpoint correct?");
        return;
      }

      if (response.ok) {
        // We pass the ENTIRE object to App.js so it has the name and phone number!
        onLogin(data); 
      } else {
        setErrorMessage(data.message || "Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error. Please check your backend connection and Wi-Fi.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={authStyles.container}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
          
          <View style={authStyles.logoContainer}>
            <Image 
              source={require('../assets/logos/SarakWay-logo.png')} 
              style={authStyles.logoImage} 
              resizeMode="contain" 
            />
            <Text style={authStyles.title}>Welcome Back</Text>
            <Text style={authStyles.subtitle}>Sign in to SarakWay Portal</Text>
          </View>

          <View style={authStyles.formContainer}>
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
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={authStyles.primaryButton} onPress={handleSignIn}>
              <Text style={authStyles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <View style={authStyles.switchContainer}>
              <Text style={authStyles.switchText}>Don't have an account?</Text>
              <TouchableOpacity onPress={onSwitchToSignUp}>
                <Text style={authStyles.switchLink}>Sign Up</Text>
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
