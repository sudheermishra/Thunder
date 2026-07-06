const password = document.getElementById("pswrd");
const output = document.querySelector("h2");

password.addEventListener("input", () => {
  const val = password.value;

  // capital , small , number , special   ASCI table ke base pe compare krenge

  let hasCapital = false,
    hasSmall = false,
    hasNumber = false,
    hasSpecial = false;

  for (let i = 0; i < val.length; i++) {
    let ch = val[i];
    if (ch >= "A" && ch <= "Z") {
      hasCapital = true;
    } else if (ch >= "a" && ch <= "z") {
      hasSmall = true;
    } else if (ch >= "0" && ch <= "9") {
      hasNumber = true;
    } else {
      hasSpecial = true;
    }
  }

  if (val.length >= 8 && hasCapital && hasSmall && hasNumber && hasSpecial) {
    output.textContent = "Strong";
    output.style.color = "green";
  } else {
    output.textContent = "Week";
    output.style.color = "red";
    return;
  }
});
