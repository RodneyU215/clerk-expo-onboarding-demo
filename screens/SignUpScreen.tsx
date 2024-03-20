import * as React from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useClerk, useSignUp } from '@clerk/clerk-expo';
import { log } from '../logger';
import { RootStackScreenProps } from '../types';
import { styles } from '../components/Styles';
import { OAuthButtons } from '../components/OAuth';
import type { SignUpResource } from '@clerk/types';

export default function SignUpScreen({
  navigation,
}: RootStackScreenProps<'SignUp'>) {
  const { isLoaded, signUp } = useSignUp();
  const { setActive } = useClerk();
  const [currentStep, setCurrentStep] = React.useState(1); // 1: SignUp, 2: Onboarding, 3: VerifyCode
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [code, setCode] = React.useState('');
  const [signUpResource, setSignUpResource] =
    React.useState<SignUpResource | null>(null);

  // Step 1: Sign Up
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      setSignUpResource(
        await signUp.create({
          firstName,
          lastName,
          emailAddress,
          password,
        })
      );

      setCurrentStep(2);
    } catch (err: any) {
      logError(err);
    }
  };

  /**
   * Sets the user's location.
   * This function is part of the onboarding flow and is called after the user has successfully signed up.
   * It relies on the signUpResource being initialized and not null, which is set during the signUp process.
   */
  const updateUserLocation = async () => {
    if (!signUpResource) {
      log(
        'signUpResource is not initialized, skipping location update.'
      );
      return;
    }

    try {
      // In this example, we're updating the user's location.
      // In your code, you may call your backend API here to store any additional onboarding info.
      await signUpResource.update({ unsafeMetadata: { location } });
    } catch (err: any) {
      logError(`Failed to update user location: ${err.message}`);
    }
  };

  // Step 2: Onboarding
  const onOnboardingPress = async () => {
    try {
      await updateUserLocation();
      await signUp!.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      setCurrentStep(3);
    } catch (err: any) {
      logError(err);
      setCurrentStep(1);
    }
  };

  // Step 3: VerifyCode
  const onVerifyPress = async () => {
    try {
      const completeSignUp =
        await signUp!.attemptEmailAddressVerification({
          code,
        });
      await setActive({ session: completeSignUp.createdSessionId });
      navigation.navigate('MyProfile');
    } catch (err: any) {
      logError(err);
    }
  };

  // Error Logging Helper
  const logError = (err: any) => {
    log('Error:> ' + err?.status || '');
    log('Error:> ' + err?.errors ? JSON.stringify(err.errors) : err);
  };

  const onSignInPress = () => navigation.replace('SignIn');

  const signUpView = () => (
    <>
      <View style={styles.oauthView}>
        <OAuthButtons />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={firstName}
          style={styles.textInput}
          placeholder="First name..."
          placeholderTextColor="#000"
          onChangeText={(fn) => {
            setFirstName(fn);
          }}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={lastName}
          style={styles.textInput}
          placeholder="Last name..."
          placeholderTextColor="#000"
          onChangeText={(ln) => {
            setLastName(ln);
          }}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          style={styles.textInput}
          placeholder="Email..."
          placeholderTextColor="#000"
          onChangeText={(email) => setEmailAddress(email)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={password}
          style={styles.textInput}
          placeholder="Password..."
          placeholderTextColor="#000"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onSignUpPress}
      >
        <Text style={styles.primaryButtonText}>Sign up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Have an account?</Text>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSignInPress}
        >
          <Text style={styles.secondaryButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const onboardingView = () => (
    <>
      <View style={styles.inputView}>
        <TextInput
          value={location}
          style={styles.textInput}
          placeholder="Where are you located?..."
          placeholderTextColor="#000"
          onChangeText={(loc) => setLocation(loc)}
        />
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 10,
            color: '#6e6e6e',
            marginVertical: 5,
          }}
        >
          Upon completion, we'll verify your email address.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onOnboardingPress}
        >
          <Text style={styles.primaryButtonText}>
            Complete Onboarding
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const verifyCodeScreen = () => (
    <>
      <View style={styles.inputView}>
        <TextInput
          value={code}
          style={styles.textInput}
          placeholder="Code..."
          placeholderTextColor="#000"
          onChangeText={(code) => setCode(code)}
        />
      </View>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={onVerifyPress}
      >
        <Text style={styles.primaryButtonText}>Verify Email</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      {currentStep === 1 && signUpView()}
      {currentStep === 2 && onboardingView()}
      {currentStep === 3 && verifyCodeScreen()}
    </View>
  );
}
