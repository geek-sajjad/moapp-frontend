import { Injectable } from '@angular/core';
import { PersonService } from './person.service';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor(
    private personService: PersonService,
    private transactionService: TransactionService
  ) {}

  // exportToJson(): void {
  //   const data = {
  //     people: this.personService.getAllPeople(),
  //     transactions: this.transactionService.getAllTransactions()
  //   };

  //   const jsonData = JSON.stringify(data, null, 2);
  //   const blob = new Blob([jsonData], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
    
  //   const date = new Date().toLocaleDateString('fa-IR').replace(/\//g, '-');
  //   a.href = url;
  //   a.download = `moein-data-${date}.json`;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);
  // }

  shareStatement(personName: string, transactions: any[]): void {
    if (transactions.length === 0) {
      return;
    }

    let total = 0;
    let message = `📄 صورت‌حساب: ${personName}\n`;
    message += `📅 تاریخ: ${new Date().toLocaleDateString('fa-IR')}\n`;
    message += `--------------------------\n`;

    transactions.forEach(t => {
      const type = t.type === 'DEBIT' ? 'طلبتان' : 'بدهی‌تان';
      message += `${t.date}: ${t.amount.toLocaleString('fa-IR')} تومان (${type})\n`;
      total += t.type === 'DEBIT' ? t.amount : -t.amount;
    });

    message += `--------------------------\n`;
    message += `💰 مانده نهایی: ${Math.abs(total).toLocaleString('fa-IR')} تومان\n`;
    message += total >= 0 ? '🔵 طلبکار هستید' : '🔴 بدهکار هستید';
    message += `\n\n+دفتر معین شخصی+`;

    if (navigator.share) {
      navigator.share({ 
        title: 'صورت‌حساب', 
        text: message 
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      const el = document.createElement('textarea');
      el.value = message;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  }
}
