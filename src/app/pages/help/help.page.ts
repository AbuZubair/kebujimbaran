import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  isMenuOpen: Array<boolean> = [false]
  dataFaq = [
    {
      a_id:`Hubungi Kami`,
      a_en:`Hubungi Kami`,
      b_id:[
        `Kami dapat dihubungi melalui WhatsApp di nomor : <a href="https://api.whatsapp.com/send?phone=6281220190008" target="_blank">+62 812-2019-0008</a> dan email : <a href="mailto: admin@kebunjimbaran.com"  target="_blank">admin@kebunjimbaran.com</a>`
      ],
      b_en:[
        `Kami dapat dihubungi melalui WhatsApp di nomor : <a href="https://api.whatsapp.com/send?phone=6281220190008" target="_blank">+62 812-2019-0008</a> dan email : <a href="mailto: admin@kebunjimbaran.com"  target="_blank">admin@kebunjimbaran.com</a>`
      ]
    },
    {
      a_id:`Dimana saja wilayah layanan <a href="https://kebunjimbaran.com/">kebunjimbaran.com?</a>`,
      a_en:`Dimana saja wilayah layanan <a href="https://kebunjimbaran.com/">kebunjimbaran.com?</a>`,
      b_id:[
        `Saat ini kami melayani area Depok, Tangerang Selatan, Jakarta Selatan, dan 
        sekitarnya. Di luar wilayah tersebut akan kami layani dalam waktu dekat.`
      ],
      b_en:[
        `Saat ini kami melayani area Depok, Tangerang Selatan, Jakarta Selatan, dan 
        sekitarnya. Di luar wilayah tersebut akan kami layani dalam waktu dekat.`
      ],
    },
    {
      a_id:`Bagaimana menemukan produk?`,
      a_en:`Bagaimana menemukan produk?`,
      b_id:[
        `Silakan memilih produk sesuai kategori di bagian atas web <a href="https://kebunjimbaran.com/">kebunjimbaran.com</a>`,
        `Atau silakan mencari produk yang diinginkan dengan memasukkan nama atau kata 
        kunci dalam kolom “Search”`
      ],
      b_en:[
        `Silakan memilih produk sesuai kategori di bagian atas web <a href="https://kebunjimbaran.com/">kebunjimbaran.com</a>`,
        `Atau silakan mencari produk yang diinginkan dengan memasukkan nama atau kata 
        kunci dalam kolom “Search”`
      ]
    },
    {
      a_id:`Bagaimana cara pembayaran <a href="https://kebunjimbaran.com/">kebunjimbaran.com</a>?`,
      a_en:`Bagaimana cara pembayaran <a href="https://kebunjimbaran.com/">kebunjimbaran.com</a>?`,
      b_id:[
        `Metode pembayaran bisa Cash on Delivery (COD), atau`,
        `Transfer ke rekening admin <a href="https://kebunjimbaran.com/">kebunjimbaran.com</a>: 
        <span class="font-bold">BCA atas nama Achmad Rahditio, no 4371732980</span>`
      ],
      b_en:[
        `Metode pembayaran bisa Cash on Delivery (COD), atau`,
        `Transfer ke rekening admin <a href="https://kebunjimbaran.com/">kebunjimbaran.com</a>: 
        <span class="font-bold">BCA atas nama Achmad Rahditio, no 4371732980</span>`
      ]
    },
    {
      a_id:`Bagaimana mengecek status pesanan saya?`,
      a_en:`Bagaimana mengecek status pesanan saya?`,
      b_id:[
        `Status dapat dilihat di halaman “Detail Pesanan” yang ditampilkan setelah 
        melakukan pesanan`,
        `Link ke halaman status pesanan kami kirim juga via WhatsApp saat anda mengirim 
        bukti transfer (klik tombol KIRIM BUKTI TRANSFER)`
      ],
      b_en:[
        `Status dapat dilihat di halaman “Detail Pesanan” yang ditampilkan setelah 
        melakukan pesanan`,
        `Link ke halaman status pesanan kami kirim juga via WhatsApp saat anda mengirim 
        bukti transfer (klik tombol KIRIM BUKTI TRANSFER)`
      ]
    },
    {
      a_id:`Kapan produk dikirim?`,
      a_en:`Kapan produk dikirim?`,
      b_id:[
        `Pesanan akan dikirim sesuai hari pengiriman yang kami cantumkan di sisi kiri atas 
        halaman utama web kebunjimbaran.com. Estimasi pesanan tiba sekitar jam 9 di hari 
        itu.`
      ],
      b_en:[
        `Pesanan akan dikirim sesuai hari pengiriman yang kami cantumkan di sisi kiri atas 
        halaman utama web kebunjimbaran.com. Estimasi pesanan tiba sekitar jam 9 di hari 
        itu.`
      ]
    },
    {
      a_id:`Bagaimana jika produk tidak lengkap atau terdapat kesalahan?`,
      a_en:`Bagaimana jika produk tidak lengkap atau terdapat kesalahan?`,
      b_id:[
        `Anda dapat menghubungi CS kami di nomor <a href="https://api.whatsapp.com/send?phone=6281220190008" target="_blank">+62 812-2019-0008</a>. Kami akan segera cek 
        dan respon.`
      ],
      b_en:[
        `Anda dapat menghubungi CS kami di nomor <a href="https://api.whatsapp.com/send?phone=6281220190008" target="_blank">+62 812-2019-0008</a>. Kami akan segera cek 
        dan respon.`
      ]
    },
  ]

  constructor(
    private storage: StorageService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter(){
    await this.getLang()
  }

  async getLang(){    
    let lang = await this.storage.get('lang')
    if(lang){
      this.translate.use(lang)
    }else{
      this.translate.use('id')
    }
    
  }

  toggleAccordion(i)
  {
    this.isMenuOpen[i] = !this.isMenuOpen[i];
  }

}
