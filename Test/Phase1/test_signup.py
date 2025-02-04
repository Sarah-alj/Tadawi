from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import unittest
import time

class TestSignup(unittest.TestCase):

    def setUp(self):
        # Set up the WebDriver
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:3000/signup")

    def test_signup_form(self):
        driver = self.driver

        # Fill out the signup form
        driver.find_element(By.ID, "email").send_keys("testuser@example.com")
        driver.find_element(By.ID, "password").send_keys("SecurePass123")
        driver.find_element(By.ID, "confirm-password").send_keys("SecurePass123")
        driver.find_element(By.ID, "full-name").send_keys("Test User")

        # Select gender
        gender_dropdown = driver.find_element(By.ID, "gender")
        gender_dropdown.send_keys(Keys.ARROW_DOWN)
        gender_dropdown.send_keys(Keys.RETURN)

        # Select nationality
        nationality_dropdown = driver.find_element(By.ID, "nationality")
        nationality_dropdown.send_keys(Keys.ARROW_DOWN)
        nationality_dropdown.send_keys(Keys.RETURN)

        # Accept terms and conditions
        driver.find_element(By.ID, "terms").click()

        # Submit the form
        driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        time.sleep(3)  # Wait for response

        # Check if redirected to the success page
        self.assertIn("dashboard", driver.current_url)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
