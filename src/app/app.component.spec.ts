import { StarWarsMovies } from "simpletslinq/dist/StarwarsMovies";
import { Movie } from "simpletslinq/dist/Movie";
import "simpletslinq";

class SomeClass {
  Num: number;
  Name: string;
}

class SomeOtherClass {
  SomeOtherNum: number;
  SomeName: string;
}

class Student {
  StudentID: number;
  StudentName: string;
  Age: number;
}

class Hero {
  name: string;
  gender: string;
  age: number;
  constructor(name: string = "", gender: string = "", age: number = 0) {
    this.name = name;
    this.gender = gender;
    this.age = age;
  }
}

class HeroWithAbility extends Hero {
  ability: string;
  constructor(ability: string = "") {
    super();
    this.ability = ability;
  }
}

describe("Array Extensions tests for TsExtensions Linq esque library", () => {
  it("can retrieve props for a class items of an array", () => {
    let heroes: Hero[] = [
      <Hero>{ name: "Han Solo", age: 44, gender: "M" },
      <Hero>{ name: "Leia", age: 29, gender: "F" },
      <Hero>{ name: "Luke", age: 24, gender: "M" },
      <Hero>{ name: "Lando", age: 47, gender: "M" }
    ];
    let foundProps = heroes.GetProperties(Hero, false);
    //debugger
    let expectedArrayOfProps = ["name", "age", "gender"];
    expect(foundProps).toEqual(expectedArrayOfProps);
    expect(heroes.GetProperties(Hero, true)).toEqual(["age", "gender", "name"]);
  });

  it("can retrieve props for a class only knowing its function", () => {
    let heroes: Hero[] = [];
    let foundProps = heroes.GetProperties(Hero, false);
    let expectedArrayOfProps = ["this.name", "this.gender", "this.age"];
    expect(foundProps).toEqual(expectedArrayOfProps);
    let foundPropsThroughClassFunction = heroes.GetProperties(Hero, true);
    //debugger
    expect(
      foundPropsThroughClassFunction.SequenceEqual([
        "this.age",
        "this.gender",
        "this.name"
      ])
    ).toBe(true);
  });

  it("can apply method ToDictionary on an array, allowing specificaton of a key selector for the dictionary object", () => {
    let heroes = [
      { name: "Han Solo", age: 44, gender: "M" },
      { name: "Leia", age: 29, gender: "F" },
      { name: "Luke", age: 24, gender: "M" },
      { name: "Lando", age: 47, gender: "M" }
    ];
    let dictionaryOfHeroes = heroes.ToDictionary<Hero>(x => x.name);

    let expectedDictionary = {
      "Han Solo": {
        name: "Han Solo",
        age: 44,
        gender: "M"
      },
      Leia: {
        name: "Leia",
        age: 29,
        gender: "F"
      },
      Luke: {
        name: "Luke",
        age: 24,
        gender: "M"
      },
      Lando: { name: "Lando", age: 47, gender: "M" }
    };
    expect(dictionaryOfHeroes).toEqual(expectedDictionary);
  });

  it("can apply method Cast on an array, casting items to other type", () => {
    let heroes = [
      { name: "Han Solo", age: 44, gender: "M" },
      { name: "Leia", age: 29, gender: "F" },
      { name: "Luke", age: 24, gender: "M" },
      { name: "Lando", age: 47, gender: "M" }
    ];
    let castedArray = heroes.Cast<HeroWithAbility>(HeroWithAbility);
    let expectedArrayString =
      '[{"name":"Han Solo","age":44,"gender":"M","ability":null},{"name":"Leia","age":29,"gender":"F","ability":null},{"name":"Luke","age":24,"gender":"M","ability":null},{"name":"Lando","age":47,"gender":"M","ability":null}]';
    expect(JSON.stringify(castedArray)).toBe(expectedArrayString);
  });

  it("can decide if a compound array of objects contains our target item", () => {
    let firstMovieStarringJarJar = StarWarsMovies.FirstOrDefault<Movie>(
      m => m.main_characters.indexOf("Jar Jar Binks") > 0
    );
    let foundJarJar = StarWarsMovies.Contains(firstMovieStarringJarJar);
    expect(foundJarJar).toBe(true);
    let somenums = [1, 3, 4, 5];
    expect(somenums.Contains(4)).toBe(true);
    expect(somenums.Contains(33)).toBe(false);
  });

  it("can return the first or default result using FirstOrDefault on a given array", () => {
    let firstMovieStarringJarJar = StarWarsMovies.FirstOrDefault<Movie>(
      m => m.main_characters.indexOf("Jar Jar Binks") > 0
    );
    expect(firstMovieStarringJarJar !== null).toBe(true);
    let firstMovieStarringBruceWillis = StarWarsMovies.FirstOrDefault<Movie>(
      m => m.main_characters.indexOf("Bruce Willis") > 0
    );
    expect(firstMovieStarringBruceWillis === null).toBe(true);
  });

  it("can return the first or default result using First on a given array", () => {
    let firstMovieStarringJarJar = StarWarsMovies.First<Movie>(
      m => m.main_characters.indexOf("Jar Jar Binks") > 0
    );
    expect(firstMovieStarringJarJar !== null).toBe(true);
    expect(() =>
      StarWarsMovies.First<Movie>(
        m => m.main_characters.indexOf("Bruce Willis") > 0
      )
    ).toThrow(new Error("Invalid operation. No items found."));
  });

  it("can return the first or default result using SingleOrDefault on a given array", () => {
    let firstMovieStarringJarJar = StarWarsMovies.SingleOrDefault<Movie>(
      m => m.main_characters.indexOf("Jar Jar Binks") > 0
    );
    expect(firstMovieStarringJarJar !== null).toBe(true);
    expect(() =>
      StarWarsMovies.SingleOrDefault<Movie>(
        m => m.main_characters.indexOf("Han Solo") > 0
      )
    ).toThrow(new Error("Invalid operation. More than one items found."));
  });

  it("can return the first or default result using Single on a given array", () => {
    let firstMovieStarringJarJar = StarWarsMovies.Single<Movie>(
      m => m.main_characters.indexOf("Jar Jar Binks") > 0
    );
    expect(firstMovieStarringJarJar !== null).toBe(true);
    expect(() =>
      StarWarsMovies.Single<Movie>(
        m => m.main_characters.indexOf("Han Solo") > 0
      )
    ).toThrow(new Error("Invalid operation. More than one items found."));
  });

  it("can run reverse and return the reversed array", () => {
    let firstArray = ["One", "Two", "Three", "Four", "Five"];
    let result = firstArray.Reverse();
    expect(result).toEqual(["Five", "Four", "Three", "Two", "One"]);
  });

  it("can return a trivial empty array using Empty operator", () => {
    let emptyArray = Array.prototype.Empty();
    expect(emptyArray.length).toEqual(0);
  });

  it("can concatenate two arrays and return all items from both arrays into one array concatenated", () => {
    let firstArray = ["One", "Two", "Three", "Four", "Five"];
    let secondArray = ["Four", "Five", "Six", "Seven", "Eight"];
    let result = firstArray.Concat(secondArray);
    expect(result).toEqual([
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight"
    ]);
  });

  it("can return a union of two arrays into one array with distinct items of these two", () => {
    let firstArray = ["One", "Two", "Three", "Four", "Five"];
    let secondArray = ["Four", "Five", "Six", "Seven", "Eight"];
    let result = firstArray.Union(secondArray);
    expect(result).toEqual([
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight"
    ]);
  });

  it("can run Intersect to find items in both arrays", () => {
    let firstArray = ["One", "Two", "Three", "Four", "Five"];
    let secondArray = ["Four", "Five", "Six", "Seven", "Eight"];
    let result = firstArray.Intersect(secondArray);
    expect(result).toEqual(["Four", "Five"]);
  });

  it("can run Except to filter out items from the other array present also in the first array", () => {
    let firstArray = ["One", "Two", "Three", "Four", "Five"];
    let secondArray = ["Four", "Five", "Six", "Seven", "Eight"];
    let result = firstArray.Except(secondArray);
    expect(result).toEqual(["One", "Two", "Three"]);
  });

  it("can aggregate items to expected result using Aggregate on array of items of numbers", () => {
    let someNums = [1, 2, 3, 4];
    let result = someNums.Aggregate(0, 0, null);
    expect(result).toBe(10);
  });

  it("can sum items to expected result using Sum on array of items of numbers", () => {
    let someNums = [1, 2, 3, 4, 14];
    let result = someNums.Aggregate(0, 0, null);
    expect(result).toBe(24);
  });

  it("can sum items to expected result using SumSelect on array of items of numbers", () => {
    let someArray: any[] = [];
    someArray.push(<SomeClass>{ Name: "Foo", Num: 1 });
    someArray.push(<SomeClass>{ Name: "FooBaz", Num: 4 });
    someArray.push(<SomeClass>{ Name: "AllyoBaze", Num: 7 });
    let result = someArray.SumSelect<SomeClass>("Num");
    expect(result).toBe(12);
  });

  it("can count items to expected result using Count on array of items of numbers", () => {
    let someNums = [1, 2, 3, 4];
    let result = someNums.Count();
    expect(result).toBe(4);
  });

  it("can average items to expected result using Average on array of items of numbers", () => {
    let someArray: Student[] = [];
    someArray.push(<Student>{ StudentID: 1, StudentName: "John", Age: 13 });
    someArray.push(<Student>{ StudentID: 2, StudentName: "Moin", Age: 21 });
    someArray.push(<Student>{ StudentID: 3, StudentName: "Bill", Age: 18 });
    someArray.push(<Student>{ StudentID: 4, StudentName: "Ram", Age: 20 });
    someArray.push(<Student>{ StudentID: 5, StudentName: "Ron", Age: 15 });
    let result = someArray.AverageSelect<Student>("Age");
    expect(result).toBe(17.4);
  });

  it("can filter out duplicates using DistinctBy on array of items of objects", () => {
    let someArray: Student[] = [];
    someArray.push(<Student>{ StudentID: 1, StudentName: "John", Age: 13 });
    someArray.push(<Student>{ StudentID: 2, StudentName: "Moin", Age: 21 });
    someArray.push(<Student>{ StudentID: 2, StudentName: "Moin", Age: 21 });
    someArray.push(<Student>{ StudentID: 4, StudentName: "Ram", Age: 20 });
    someArray.push(<Student>{ StudentID: 5, StudentName: "Ron", Age: 15 });
    let expectedArray: Student[] = [];
    expectedArray.push(<Student>{ StudentID: 1, StudentName: "John", Age: 13 });
    expectedArray.push(<Student>{ StudentID: 2, StudentName: "Moin", Age: 21 });
    expectedArray.push(<Student>{ StudentID: 4, StudentName: "Ram", Age: 20 });
    expectedArray.push(<Student>{ StudentID: 5, StudentName: "Ron", Age: 15 });
    let result = someArray.DistinctBy<Student>("StudentID");
    expect(result).toEqual(expectedArray);
  });

  it("can filter out duplicates using Distinct on array of items of numbers", () => {
    let someNums = [1, 2, 2, 3, 3, 4, 5, 6, 7, 7, 1];
    let someNumsRemovedDuplicates = someNums.Distinct();
    expect(someNumsRemovedDuplicates).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("can average items to expected result using AverageSelect on array of items of numbers", () => {
    let someNums = [1, 2, 3, 4, 5];
    let result = someNums.Average();
    expect(result).toBe(3);
  });

  it("can count items by condition to expected using CountBy result on array of items of numbers", () => {
    let someNums = [1, 2, 3, 4];
    let result = someNums.CountBy<any>(x => x % 2 === 0);
    expect(result).toBe(2);
  });

  it("can aggregate items and project to expected result using AggregateSelect on array of items of objects", () => {
    let someArray: any[] = [];
    someArray.push(<SomeClass>{ Name: "Foo", Num: 1 });
    someArray.push(<SomeClass>{ Name: "FooBaz", Num: 4 });
    someArray.push(<SomeClass>{ Name: "AllyoBaze", Num: 7 });
    let result = someArray.AggregateSelect<SomeClass>("Num", 0, 0, null);
    expect(result).toBe(12);
  });

  it("can aggregate once more items and project to expected result using AggregateSelect on array of items of objects with accumulator value set initially", () => {
    let someArray: Student[] = [];
    someArray.push(<Student>{ StudentID: 1, StudentName: "John", Age: 13 });
    someArray.push(<Student>{ StudentID: 2, StudentName: "Moin", Age: 21 });
    someArray.push(<Student>{ StudentID: 3, StudentName: "Bill", Age: 18 });
    someArray.push(<Student>{ StudentID: 4, StudentName: "Ram", Age: 20 });
    someArray.push(<Student>{ StudentID: 5, StudentName: "Ron", Age: 15 });
    let result = someArray.AggregateSelect<Student>(
      "StudentName",
      "Student Names: ",
      0,
      (a, b) => a + "," + b
    );
    expect(result).toBe("John,Moin,Bill,Ram,Ron");
  });

  it("can take two items using Take(2)", () => {
    let starwarsMovies = StarWarsMovies;
    let firstTwoMovies = starwarsMovies
      .Take<Movie>(2)
      .Select<Movie>("title")
      .map(m => m.title);
    expect(firstTwoMovies[0].toLowerCase()).toContain("phantom menace");
    expect(firstTwoMovies[1].toLowerCase()).toContain("attack of the clones");
  });

  it("can take two items using Skip(4)", () => {
    let starwarsMovies = StarWarsMovies;
    let lastTwoMovies = starwarsMovies
      .Skip<Movie>(4)
      .Select<Movie>("title")
      .map(m => m.title);
    expect(lastTwoMovies[0].toLowerCase()).toContain("empire strikes back");
    expect(lastTwoMovies[1].toLowerCase()).toContain("return of the jedi");
  });

  it("can take next last movie using Skip(4).Take(1)", () => {
    let starwarsMovies = StarWarsMovies;
    let fiftMovie = starwarsMovies
      .Skip<Movie>(4)
      .Take(1)
      .Select<Movie>("title")
      .map(m => m.title);
    expect(fiftMovie[0].toLowerCase()).toContain("empire strikes back");
    expect(fiftMovie.length).toBe(1);
  });

  it("can find desired items using OfType of type T", () => {
    let someMixedArray: any[] = [];
    someMixedArray.push(<SomeClass>{ Name: "Foo", Num: 1 });
    someMixedArray.push(<SomeOtherClass>{
      SomeName: "BarBazBaze",
      SomeOtherNum: 813
    });
    someMixedArray.push(<SomeClass>{ Name: "FooBaz", Num: 4 });
    someMixedArray.push(<SomeOtherClass>{
      SomeName: "BarBaze",
      SomeOtherNum: 13
    });
    someMixedArray.push(<SomeClass>{ Name: "AllyoBaze", Num: 7 });

    let compareObject = <SomeClass>{ Name: "", Num: 0 };
    let filteredArrayBySpecifiedType = someMixedArray.OfType(compareObject);
    console.log(filteredArrayBySpecifiedType);

    expect(
      filteredArrayBySpecifiedType.All(item => <SomeClass>item !== undefined)
    ).toBe(
      true,
      "Expected only items of type SomeOtherClass in the filtered array after running OfType of SomeOtherClass on it."
    );
  });

  it("can take while using TakeWhile upon predicate the expected sequence", () => {
    let someArray = [2, 4, 8, 12, 18, 13, 11];
    expect(someArray.TakeWhile<any>(x => x % 2 == 0)).toEqual([
      2,
      4,
      8,
      12,
      18
    ]);
  });

  it("can skip while using SkipWhile upon predicate the expected sequence", () => {
    let someArray = [2, 4, 8, 12, 18, 13, 11];
    expect(someArray.SkipWhile<any>(x => x % 2 == 0)).toEqual([13, 11]);
  });

  it("can intersect two arrays and return expected", () => {
    let someArray = [1, 2, 3, 4, 5, 6, 7];
    let otherArray = [5, 6, 7, 9, 11];
    let intersection = someArray.Intersect(otherArray);
    expect(intersection).toEqual([5, 6, 7]);
  });

  it("can intersect two arrays and project out property and return expected", () => {
    let someArray = [
      { Country: "Norway", Capital: "Oslo" },
      { Country: "Denmark", Capital: "Copenhagen" },
      { Country: "Burkina Faso", Capital: "Ougadougou" },
      { Country: "Finland", Capital: "Helsinki" }
    ];
    let otherArray = [
      { Country: "France", Capital: "Paris" },
      { Country: "Germany", Capital: "Berlin" },
      { Country: "Burkina Faso", Capital: "Ougadougou" },
      { Country: "Finland", Capital: "Helsinki" }
    ];

    let intersection = someArray.IntersectSelect("Country", otherArray);
    expect(intersection).toEqual([
      { Country: "Burkina Faso", Capital: "Ougadougou" },
      { Country: "Finland", Capital: "Helsinki" }
    ]);
  });

  it("can find maximum of arrays using Max,", () => {
    let inputArray = [1, 2, 3, 4, 5, 6, 7, 15, 4];
    expect(inputArray.Max()).toBe(15);
    let inputArrayOfChars = ["a", "b", "c", "d", "A", "B", "C"];
    expect(inputArrayOfChars.Max()).toBe("d");
  });

  it("can find maximum of arrays using MaxSelect,", () => {
    expect(StarWarsMovies.MaxSelect<Movie>("episode_number")).toBe("6");
  });

  it("can find minimum of arrays using MinSelect,", () => {
    expect(StarWarsMovies.MinSelect<Movie>("episode_number")).toBe("1");
  });

  it("can find maximum of arrays using Min,", () => {
    let inputArray = [1, 2, 3, 4, 5, 6, 7, 15, 4];
    expect(inputArray.Min()).toBe(1);
    let inputArrayOfChars = ["a", "b", "c", "d", "A", "B", "C"];
    expect(inputArrayOfChars.Min()).toBe("A");
  });

  it("can sort using OrderBy", () => {
    let inputArray: SomeClass[] = [
      { Num: 1, Name: "Foo" },
      { Num: -3, Name: "Baze" },
      { Num: 11, Name: "BelongToUs" },
      { Num: 5, Name: "AllyoBaze" }
    ];
    let sortedArray = inputArray.OrderBy<SomeClass>(s => s.Num);

    let sortedArrayNums = sortedArray.Select<SomeClass>("Num").map(s => s.Num);
    expect(sortedArrayNums).toEqual(
      [-3, 1, 5, 11],
      "Expected that the sorting was performed on the input array."
    );
  });

  it("can sort using OrderByDescending", () => {
    let inputArray: SomeClass[] = [
      { Num: 1, Name: "Foo" },
      { Num: -3, Name: "Baze" },
      { Num: 11, Name: "BelongToUs" },
      { Num: 5, Name: "AllyoBaze" }
    ];
    let sortedArray = inputArray.OrderByDescending<SomeClass>(s => s.Num);
    let sortedArrayNums = sortedArray.Select<SomeClass>("Num").map(s => s.Num);
    expect(sortedArrayNums).toEqual(
      [11, 5, 1, -3],
      "Expected that the sorting was performed on the input array."
    );
  });

  it("can sort using OrderBy and ThenBy", () => {
    let inputArray: SomeClass[] = [
      { Num: 1, Name: "Foo" },
      { Num: -3, Name: "Baze" },
      { Num: 11, Name: "BelongToUs" },
      { Num: 5, Name: "AllyoBaze" }
    ];

    let sortedArray = inputArray
      .OrderBy<SomeClass>(s => s.Num)
      .ThenBy<SomeClass>(s => s.Name);
    console.log(sortedArray);
    let sortedArrayNames = sortedArray
      .Select<SomeClass>("Name")
      .map(s => s.Name);
    console.log(sortedArrayNames);
    expect(sortedArrayNames).toEqual(
      ["AllyoBaze", "Baze", "BelongToUs", "Foo"],
      "Expected that the sorting was performed using OrderBy and ThenBy on the input array."
    );
  });
});
