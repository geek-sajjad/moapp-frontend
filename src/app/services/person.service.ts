import { Injectable, signal, computed } from '@angular/core';
import { Person, CreatePersonDto } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private readonly STORAGE_KEY = 'moein_people';
  private peopleSignal = signal<Person[]>([]);
  
  people = this.peopleSignal.asReadonly();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const people = JSON.parse(data);
        this.peopleSignal.set(people);
      }
    } catch (error) {
      console.error('Error loading people from storage:', error);
    }
  }

  private saveToStorage(people: Person[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(people));
    } catch (error) {
      console.error('Error saving people to storage:', error);
    }
  }

  getAllPeople(): Person[] {
    return this.peopleSignal();
  }

  getPersonById(id: string): Person | undefined {
    return this.peopleSignal().find(p => p.id === id);
  }

  addPerson(dto: CreatePersonDto): Person {
    const newPerson: Person = {
      ...dto,
      id: this.generateId(),
      createdAt: new Date()
    };
    
    const updatedPeople = [...this.peopleSignal(), newPerson];
    this.peopleSignal.set(updatedPeople);
    this.saveToStorage(updatedPeople);
    
    return newPerson;
  }

  updatePerson(id: string, dto: Partial<CreatePersonDto>): Person | null {
    const people = this.peopleSignal();
    const index = people.findIndex(p => p.id === id);
    
    if (index === -1) return null;
    
    const updatedPerson = { ...people[index], ...dto };
    const updatedPeople = [...people];
    updatedPeople[index] = updatedPerson;
    
    this.peopleSignal.set(updatedPeople);
    this.saveToStorage(updatedPeople);
    
    return updatedPerson;
  }

  deletePerson(id: string): boolean {
    const people = this.peopleSignal();
    const filteredPeople = people.filter(p => p.id !== id);
    
    if (filteredPeople.length === people.length) return false;
    
    this.peopleSignal.set(filteredPeople);
    this.saveToStorage(filteredPeople);
    
    return true;
  }

  searchPeople(term: string): Person[] {
    const lowerTerm = term.toLowerCase();
    return this.peopleSignal().filter(p => 
      p.name.toLowerCase().includes(lowerTerm)
    );
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
