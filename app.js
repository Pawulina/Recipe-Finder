let input = document.querySelector("input");

input.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		button.click();
	}
});

const button = document.querySelector(".input-btn");

button.addEventListener("click", () => {
	const recipesContainer = document.querySelector(".recipes-container");
	const messageContainer = document.querySelector(".search-results-message");
	const query = input.value;
	const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
	if (input.value === "") {
		input.classList.add("error");
		messageContainer.textContent = `Please enter meal or an ingredient...`;
		messageContainer.style.color = "red";
		setTimeout(() => {
			input.classList.remove("error");
			messageContainer.style.display = "none";
		}, 5000);
		recipesContainer.innerHTML = "";
	} else {
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				const meals = data.meals;

				messageContainer.style.display = "block";
				messageContainer.textContent = `Let's eat some ${input.value} today`;

				recipesContainer.innerHTML = "";

				meals.forEach((meal) => {
					const card = document.createElement("div");
					card.classList.add("card");
					card.addEventListener("click", () => {
						const mealDetail = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`;
						fetch(mealDetail)
							.then((response) => response.json())
							.then((data) => {
								const meal = data.meals[0];
								const modal = document.querySelector(".overlay");
								const modalContent = document.querySelector(".modal-content");

								modal.style.display = "block";
								modalContent.style.display = "flex";

								modalContent.innerHTML = "";

								const closeButton = document.createElement("span");
								closeButton.classList.add("close-modal-btn");
								closeButton.innerHTML = "&times;";
								modalContent.appendChild(closeButton);

								closeButton.addEventListener("click", () => {
									modal.style.display = "none";
								});

								const title = document.createElement("h2");
								title.classList.add("h2-recipe-modal");
								title.textContent = meal.strMeal;
								modalContent.appendChild(title);

								const imgContainer = document.createElement("div");
								imgContainer.classList.add("img-ingrediends-wrapper");
								modalContent.appendChild(imgContainer);

								const ingredients = document.createElement("ul");
								ingredients.classList.add("ul-modal");
								ingredients.textContent = "Ingredients";
								for (let i = 1; i <= 20; i++) {
									const ingredient = meal[`strIngredient${i}`];
									const measure = meal[`strMeasure${i}`];
									if (ingredient) {
										const li = document.createElement("li");
										li.textContent = `${measure} ${ingredient}`;
										ingredients.appendChild(li);
									}
								}
								const img = document.createElement("img");
								img.classList.add("img-modal");
								img.src = meal.strMealThumb;
								imgContainer.appendChild(img);
								imgContainer.appendChild(ingredients);

								const instructions = document.createElement("p");
								instructions.classList.add("p-modal");
								instructions.textContent = meal.strInstructions;
								modalContent.appendChild(instructions);

								const overlay = document.querySelector(".overlay");

								overlay.addEventListener("click", (e) => {
									if (e.target === overlay) {
										overlay.style.display = "none";
									}
								});
							})

							.catch((error) =>
								console.error("Error during API's query:", error)
							);
					});

					const img = document.createElement("img");
					img.classList.add("card-img");
					img.src = meal.strMealThumb;
					card.appendChild(img);

					const title = document.createElement("h2");
					title.classList.add("h2-card");
					title.textContent = meal.strMeal;
					card.appendChild(title);

					recipesContainer.appendChild(card);
				});
			})
			.catch((error) => console.error("Error during API's query:", error));
	}
});
