// script.js

let totalCredits = 0;
let totalGradePoints = 0;

/************************************************************
 * Add a new course row
 ************************************************************/
function addCourse() {
  const courseList = document.getElementById("courseList");

  // Create a row
  const newCourse = document.createElement("div");
  newCourse.classList.add("row", "course", "mb-2");

  // Fill it with 4 columns: Course Code, Grade, Credits, Remove button
  newCourse.innerHTML = `
    <div class="col-md-3">
      <input
        type="text"
        class="form-control course-code"
        placeholder="Course Code"
      />
    </div>
    <div class="col-md-3">
      <input
        type="number"
        class="form-control grade"
        placeholder="Grade Point (e.g., 4.0)"
        step="0.01"
        min="0"
        max="4"
      />
    </div>
    <div class="col-md-3">
      <input
        type="number"
        class="form-control credits"
        placeholder="Credits (e.g., 3)"
        step="0.5"
        min="0"
      />
    </div>
    <div class="col-md-3">
      <button
        class="btn btn-danger"
        onclick="removeCourse(this)"
      >
        Remove
      </button>
    </div>
  `;
  courseList.appendChild(newCourse);
}

/************************************************************
 * Remove a course row
 ************************************************************/
function removeCourse(button) {
  button.parentElement.parentElement.remove();
  updateOverallCGPA();
}

/************************************************************
 * Recompute whenever user changes values
 ************************************************************/
document.addEventListener("input", function (e) {
  // Only recalc if relevant inputs change (to be safe, we can handle globally)
  if (
    e.target.id === "manualCGPA" ||
    e.target.id === "manualCredits" ||
    e.target.classList.contains("grade") ||
    e.target.classList.contains("credits")
  ) {
    updateOverallCGPA();
  }
});

/************************************************************
 * Update the total CGPA / Credits
 ************************************************************/
function updateOverallCGPA() {
  // Start with the user's "manual" CGPA & Credits
  let oldCredits = parseFloat(document.getElementById("manualCredits").value) || 0;
  let oldCgpa = parseFloat(document.getElementById("manualCGPA").value) || 0;
  let oldPoints = oldCgpa * oldCredits;

  // Summation for new courses
  let newCredits = 0;
  let newPoints = 0;

  // For each added row
  const courses = document.querySelectorAll(".course");
  courses.forEach((course) => {
    let gradeVal = parseFloat(course.querySelector(".grade").value);
    let creditsVal = parseFloat(course.querySelector(".credits").value);

    if (!isNaN(gradeVal) && !isNaN(creditsVal)) {
      newCredits += creditsVal;
      newPoints += gradeVal * creditsVal;
    }
  });

  let combinedCredits = oldCredits + newCredits;
  let combinedPoints = oldPoints + newPoints;

  let finalCGPA = "0.00";
  if (combinedCredits > 0) {
    finalCGPA = (combinedPoints / combinedCredits).toFixed(2);
  }

  // Display
  document.getElementById("overallCGPA").textContent = finalCGPA;
  document.getElementById("overallCredits").textContent = combinedCredits;
}
