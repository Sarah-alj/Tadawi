from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Initialize the WebDriver
driver = webdriver.Chrome()

# Open the Tadawi login page
driver.get("http://localhost:3000/login")

# Locate the email field and input email
email_input = driver.find_element(By.ID, "email")
email_input.send_keys("testuser@example.com")

# Locate the password field and input password
password_input = driver.find_element(By.ID, "password")
password_input.send_keys("Test@123")

# Click the login button
login_button = driver.find_element(By.XPATH, "//button[@type='submit']")
login_button.click()

# Wait for redirection
time.sleep(3)

# Verify successful login
if "dashboard" in driver.current_url:
    print("Login Test Passed")
else:
    print("Login Test Failed")

# Close the browser
driver.quit()
