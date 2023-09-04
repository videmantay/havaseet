/**
 * Represent a human in the classroom
 * @author Lee ViDemantay
 */

 class Person{
    constructor(first, last, picurl){
        this.firstName = first;
        this.lastName = last;
        this.pic = picurl;
    }
}

class Student extends Person{};
class Teacher extends Person{};
class Faculty extends Person{};