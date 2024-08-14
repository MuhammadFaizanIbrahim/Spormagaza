import React, { useEffect, useState } from 'react';
import './About.css';
import AOS from 'aos';
import 'aos/dist/aos.css';



const About = () => {

    const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isZoomed = scrollY > 100; // Change this value as needed

  useEffect(() => {
    AOS.init({
      duration: 1200,
      // Remove once: true to enable animations every time
    });
    
    // Optionally, refresh AOS when component mounts to ensure animations trigger correctly
    AOS.refresh();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className='fullAbout'>
      <div className='aboutLeftSide'>
        {/* <img src={leaf} className={`aboutLeaf ${isZoomed ? 'zoom' : ''}`} alt="Halil Tea Leaf" /> */}
        <span className='aboutQuestion' data-aos='fade-up'>Biz Kimiz?</span>
        <span className='aboutName' data-aos='fade-up'>"Haliloğlu Çay İşletmeleri"</span>
        <span className='aboutParagraph' data-aos='fade-up'>
            <b>Haliloğlu Çay İşletmeleri</b>, Türkiye’nin ilk ve tek kıvrım çay üretim fabrikası olarak sektörde önemli bir yer edinmiştir. İbrahim Yavuz tarafından kurulan firmamız, Rize'deki <b>10.000 m²</b> kapalı fabrikasında faaliyet göstermektedir.
            <br />
            <br />
            Kurucumuz <b>İbrahim Yavuz</b>, çay sektöründe yenilikçi yaklaşımları ve vizyoner bakış açısıyla tanınan bir isimdir. Babasının ismini yaşatmak adına firmamızı uzun yıllar boyunca hatırlanacak bir başarıya imza atmıştır. Çay üretimindeki bilgi ve tecrübesi, Haliloğlu Çay İşletmeleri’nin başarısının ardındaki en önemli faktörlerden biridir. İbrahim Yavuz'un liderliğinde, firmamız her zaman kaliteyi ve müşteri memnuniyetini ön planda tutarak, sektörde öncü konumunu sürdürmektedir.
            <br />
            <br />
            Haliloğlu Çay İşletmeleri olarak, Türk çayı için yeni bir dönem başlatıyoruz. Türk çayını dünya çapında tanıtma ve sektördeki liderliğimizi koruma misyonuyla hareket ediyoruz. Doğaya ve insan sağlığına saygılı, sürdürülebilir üretim yöntemlerini benimseyerek, en yüksek kalitede çay üretimi gerçekleştiriyoruz. Yılların verdiği deneyim ve bilgi birikimi ile müşterilerimize en iyi ürünleri sunmayı hedefliyoruz.
            </span>
        
      </div>
      <div className='aboutRightSide'>
        {/* <img src={leaves} className={`aboutLeaves ${isZoomed ? 'zoom' : ''}`} alt="Halil Tea Leaf" /> */}
        {/* <img src={descImage} className={`aboutImage ${isZoomed ? 'zoom' : ''}`} alt="Halil Tea Leaf" /> */}
      </div>
    </div>
  )
}

export default About