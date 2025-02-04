from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import unittest

class TestLogin(unittest.TestCase):
    
    def setUp(self):
        """Setup Selenium WebDriver"""
        self.driver = webdriver.Chrome()  # Ensure you have chromedriver installed
    
    def test_login_valid_user(self):
        """Test login with valid credentials"""
        driver = self.driver
        driver.get("http://localhost:3000/login")  # Update with your actual URL
        
        email_input = driver.find_element(By.ID, "email")
        password_input = driver.find_element(By.ID, "password")
        login_button = driver.find_element(By.TAG_NAME, "button")

        email_input.send_keys("validuser@example.com")
        password_input.send_keys("validpassword")
        login_button.click()

        time.sleep(3)  # Wait for login to process

        # Verify successful login by checking the redirected page
        self.assertIn("dashboard", driver.current_url)

    def test_login_invalid_user(self):
        """Test login with invalid credentials"""
        driver = self.driver
        driver.get("http://localhost:3000/login")
        
        email_input = driver.find_element(By.ID, "email")
        password_input = driver.find_element(By.ID, "password")
        login_button = driver.find_element(By.TAG_NAME, "button")

        email_input.send_keys("invaliduser@example.com")
        password_input.send_keys("wrongpassword")
        login_button.click()

        time.sleep(3)  # Wait for response

        # Verify failed login (check if an error message appears)
        error_message = driver.find_element(By.CLASS_NAME, "error").text
        self.assertEqual(error_message, "Invalid email or password")

    def tearDown(self):
        """Close the browser after test"""
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
