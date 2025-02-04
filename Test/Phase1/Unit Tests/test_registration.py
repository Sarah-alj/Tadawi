from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Initialize WebDriver
driver = webdriver.Chrome()

# Open the Tadawi registration page
driver.get("http://localhost:3000/signup")

# Fill in the registration form
driver.find_element(By.ID, "full-name").send_keys("Test User")
driver.find_element(By.ID, "email").send_keys("newuser@example.com")
driver.find_element(By.ID, "password").send_keys("NewPass@123")
driver.find_element(By.ID, "confirm-password").send_keys("NewPass@123")

# Select title
title_dropdown = driver.find_element(By.ID, "title")
title_dropdown.send_keys("Dr")

# Select gender
gender_dropdown = driver.find_element(By.ID, "gender")
gender_dropdown.send_keys("Male")

# Select nationality
nationality_dropdown = driver.find_element(By.ID, "nationality")
nationality_dropdown.send_keys("Saudi")

# Accept terms and conditions
driver.find_element(By.ID, "terms").click()

# Submit form
driver.find_element(By.XPATH, "//button[@type='submit']").click()

# Wait for confirmation
time.sleep(3)

# Verify success message
if "Welcome" in driver.page_source:
    print("Registration Test Passed")
else:
    print("Registration Test Failed")

# Close the browser
driver.quit()
