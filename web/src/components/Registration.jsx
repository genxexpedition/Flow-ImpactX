import {useState} from "react"
import useAppContext from "src/hooks/useAppContext"
import Button from "./Button"
import Dialog from "./Dialog"
import TextInput from "./TextInput"

const PUBLIC_PASSWORD = "ImpactXItems"

export const LOGGED_IN_ADMIN_ADDRESS_KEY = "ImpactX_items_logged_in_admin_address"

export default function AdminLogInDialog() {
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState(false)
  const {showAdminLoginDialog, setShowAdminLoginDialog, logInAdmin} =
    useAppContext()

  const closeDialog = () => {
    setShowAdminLoginDialog(false)
    setPasswordError(false)
    setPassword("")
  }

  const onSubmit = e => {
    e.preventDefault()

    setPasswordError(false)

    if (password.toLowerCase() !== PUBLIC_PASSWORD.toLowerCase()) {
      setPasswordError(true)
      return
    }

    logInAdmin()

    setPassword("")
  }

  return (
    <div class="testbox">
      <form action="/">
        <div class="banner">
          <h1>Roommate Application Form</h1>
        </div>
        <div class="item">
          <p>Name</p>
          <div class="name-item">
            <input type="text" name="name" placeholder="First" />
            <input type="text" name="name" placeholder="Last" />
          </div>
        </div>
        <div class="contact-item">
          <div class="item">
            <p>Email</p>
            <input type="text" name="name"/>
          </div>
          <div class="item">
            <p>Phone</p>
            <input type="text" name="name"/>
          </div>
        </div>
        <div class="item">
          <p>Student Status</p>
          <input type="text" name="name"/>
        </div>
        <div class="item">
          <p>Roommate Preferences</p>
          <textarea rows="3" required></textarea>
        </div>
        <div class="item">
          <p>Pet Restrictions</p>
          <textarea rows="3" required></textarea>
        </div>
        <div class="item">
          <p>If you are looking for property to share, describe below the neighborhoods you are interested in, the amenities, utilities, etc.</p>
          <textarea rows="3" required></textarea>
        </div>
        <div class="item">
          <p>If you are looking for a roommate to share your property, describe below the property, furnished or unfurnished, and amenities</p>
          <textarea rows="3" required></textarea>
        </div>
        <div class="item">
          <p>Monthly Rent and Utilities</p>
          <input type="text" name="name"/>
        </div>
        <div class="item">
          <p>Please provide any other pertinent information</p>
          <textarea rows="3" required></textarea>
        </div>
        <div class="btn-block">
          <button type="submit" href="/">APPLY</button>
        </div>
      </form>
    </div>
  )
}
