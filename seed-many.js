// seed-many.js
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function run() {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log('MongoDB bağlantısı OK');

		// İstersen önce koleksiyonu temizle:
		// await Product.deleteMany({});

		// 1) HAM DATA — sadece HTML’den bildiklerimiz
		const rawProducts = [
			{
				sku: '45221330437',
				name: 'PFEI-C 1.5T ASSY 45221330437',
				system: 'Philips 1.5T MRI',
				serialNumber: '989603020921',
				slug: 'pfei-c-1-5t-assy',
			},
			{
				sku: '452213274332',
				name: 'MAGNET ELECTRONICS UNIT (MEU) 452213274332',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213274332',
				slug: 'magnet-electronics-unit-meu',
			},
			{
				sku: '453564100741',
				name: 'Philips MRI WBTU Assembly 453564100741',
				system: 'Philips 1.5T MRI',
				serialNumber: '453564100741',
				slug: 'philips-mri-wbtu-assembly',
			},
			{
				sku: '452213156083',
				name: 'Philips MRI Audio Module Assembly 452213156083',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213156083',
				slug: 'philips-mri-audio-module-assembly',
			},
			{
				sku: '989803163121',
				name: 'Invivo 989803163121 (ECG)',
				system: 'Invivo',
				serialNumber: '989803163121',
				slug: 'invivo-ecg',
			},
			{
				sku: '452211790753',
				name: 'Philips Table Control Panel Button Switch 452211790753',
				system: 'Philips 1.5T MRI',
				serialNumber: '452211790753',
				slug: 'philips-table-control-panel-button-switch',
			},
			{
				sku: '452213258551',
				name: 'Philips MC1 X32 ODU CABLE 452213258551',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213258551',
				slug: 'philips-mc1-x32-odu-cable',
			},
			{
				sku: '459800343492',
				name: 'Philips MRI MC1 X30 ODU CABLE 459800343492',
				system: 'Philips 1.5T MRI',
				serialNumber: '459800343492',
				slug: 'philips-mri-mc1-x30-odu-cable',
			},
			{
				sku: '452211749241',
				name: 'Philips QBC T5A 25KW Hybride – 452211749241',
				system: 'Philips 1.5T MRI',
				serialNumber: '452211749241',
				slug: 'philips-qbc-t5a-25kw-hybride',
			},
			{
				sku: '452213168794',
				name: 'Philips 1.5T MRI 452213168794',
				system: 'Philips 1.5T MRI',
				serialNumber: '452211749241',
				slug: 'philips-1-5t-mri',
			},
			{
				sku: 'ERIKS Pressure Gauge',
				name: 'Philips ERIKS Pressure Gauge',
				system: 'Philips 1.5T MRI',
				serialNumber: 'ERIKS Pressure Gauge',
				slug: 'philips-eriks-pressure-gauge/philips-eriks-pressure-gauge',
			},
			{
				sku: '453564127061',
				name: 'Philips MRI Diversity Antenna Component Side - 453564127061',
				system: 'Philips 1.5T MRI',
				serialNumber: '453564127061',
				slug: 'philips-mri-diversity-antenna-compenent-side',
			},
			{
				sku: 'ZC9331',
				name: 'Philips MRI Burst Rupture Disk - ZC9331',
				system: 'Philips 1.5T MRI',
				serialNumber: 'ZC9331',
				slug: 'philips-mri-burst-rupture-disk',
			},
			{
				sku: '452215039281',
				name: 'Philips Axis Assembly 281+ 452215039281',
				system: 'Philips 1.5T MRI',
				serialNumber: '452215039281',
				slug: 'philips-axis-assembly-281',
			},
			{
				sku: '452213264551',
				name: 'Philips Gradient Amplifier System 281+ Cabinet 452213264551',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213264551',
				slug: 'philips-gradient-amplifier-system-281-cabinet',
			},
			{
				sku: '45221179529',
				name: 'Philips DGA Board MRI 45221179529',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221179529',
				slug: 'philips-dga-board-mri',
			},
			{
				sku: '45221179496',
				name: 'Philips GCI Board MRI 45221179496',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221179496',
				slug: 'philips-gci-board-mri',
			},
			{
				sku: '452215031182',
				name: 'Philips 601D Power Supply 452215031182',
				system: 'Philips 1.5T MRI',
				serialNumber: '452215031182',
				slug: 'philips-601-d-power-supply',
			},
			{
				sku: '452213245971',
				name: 'Philips T MAINS INLET UNIT MRI 452213245971',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213245971',
				slug: 'philips-t-mains-inlet-unit-mri',
			},
			{
				sku: '452213208993',
				name: 'Philips CDAS RACK MRI 452213208993',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213208993',
				slug: 'philips-cdas-rack-mri',
			},
			{
				sku: '45221179589',
				name: 'Philips CDAS CLK GRADM PCB Circuit Board 45221179589',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221179589',
				slug: 'philips-cdas-clk-gradm-pcb-circuit-board',
			},
			{
				sku: '45221179425',
				name: 'Philips CDAS RX2 MRI Intera Achieva Circuit Board 45221179425',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221179425',
				slug: 'philips-cdas-rx2-mri-intera-achiva-circuit-board',
			},
			{
				sku: '45221179445',
				name: 'Philips 1.5T Nova Dual CDAS_PAT MRI 45221179445',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221179445',
				slug: 'philips-1-5t-nova-dual-cdas-pat-mri',
			},
			{
				sku: '45221179587',
				name: 'Philips CDAS GRADM V2.0 MRI 45221179587',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221179587',
				slug: 'philips-cdas-gradm-v2-0-mri',
			},
			{
				sku: '45356703132',
				name: 'Philips 1.5T Nova Dual CDAS BULK IF MRI 45356703132',
				system: 'Philips 1.5T MRI',
				serialNumber: '45356703132',
				slug: 'philips-1-5t-nova-dual-cdas-bulk-if-mri',
			},
			{
				sku: '45221179725',
				name: 'Philips CDAS TXR V2 Board MRI 45221179725',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221179725',
				slug: 'philips-cdas-txr-v2-board-mri',
			},
			{
				sku: '452215034253',
				name: 'Philips MRI CDAS SBC Board 452215034253',
				system: 'Philips 1.5T MRI',
				serialNumber: '452215034253',
				slug: 'philips-mri-cdas-sbc-board',
			},
			{
				sku: 'CPA500-4530G',
				name: 'POWER-ONE CPA500-4530G',
				system: 'Philips 1.5T MRI',
				serialNumber: 'CPA500-4530G',
				slug: 'power-one-cpa500-4530g',
			},
			{
				sku: '452213203242',
				name: 'Philips RF Power Amplifier 452213203242',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213203242',
				slug: 'philips-rf-power-amplifier',
			},
			{
				sku: '452213184542',
				name: 'Philips BE Box Assy 452213184542',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213184542',
				slug: 'philips-be-box-assy',
			},
			{
				sku: '45221179032',
				name: 'Philips FIBER CARD 45221179032',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221179032',
				slug: 'philips-fiber-card',
			},
			{
				sku: '45221179034',
				name: 'Philips AUDIO SWITCH 2 45221179034',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221179034',
				slug: 'philips-audio-switch-2',
			},
			{
				sku: '45221317340',
				name: 'Philips cable 45221317340',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221317340',
				slug: 'philips-cable',
			},
			{
				sku: '452213277662',
				name: 'Philips Cable BH-X80 BEB-X2 452213277662',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213277662',
				slug: 'philips-cable-bh-x80-beb-x2',
			},
			{
				sku: '452213238170',
				name: 'Philips Phantom Bottle 2000 cc L13 452213238170',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213238170',
				slug: 'philips-phantom-bottle-2000-cc-l13',
			},
			{
				sku: '452213081914',
				name: 'Philips Phantom Bottle 1000 cc 452213081914',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213081914',
				slug: 'philips-phantom-bottle-1000-cc',
			},
			{
				sku: '452213096104',
				name: 'Philips Phantom Bottle 5000 cc 452213096104',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213096104',
				slug: 'philips-phantom-bottle-5000-cc',
			},
			{
				sku: '452213081904',
				name: 'Philips Phantom Bottle 250 cc 452213081904',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213081904',
				slug: 'philips-phantom-bottle-250-cc',
			},
			{
				sku: '452213238481',
				name: 'Philips Phantom Bottle 250 cc liquid 13 452213238481',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213238481',
				slug: 'philips-phantom-bottle-250-cc-liquid-13',
			},
			{
				sku: '452213262381',
				name: 'Philips Phantom Refill Bottle 452213262381',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213262381',
				slug: 'philips-phantom-refill-bottle',
			},
			{
				sku: '452213276391',
				name: 'Philips SPHERE PHANTOM HOLDER 452213276391',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213276391',
				slug: 'philips-sphere-phantom-holder',
			},
			{
				sku: '452213309230',
				name: 'Philips Bottle Holder 452213309230',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213309230',
				slug: 'philips-bottle-holder',
			},
			{
				sku: '452213095954',
				name: 'Philips Phantom 1000 ml Demi water 452213095954',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213095954',
				slug: 'philips-phantom-1000-ml-demi-water',
			},
			{
				sku: '452215042291',
				name: 'Philips Phantom Holder Knee Foot Ankle Coil 4Ch 452215042291',
				system: 'Philips 1.5T MRI',
				serialNumber: '452215042291',
				slug: 'philips-phantom-holder-knee-foot-ankle-coil-4ch',
			},
			{
				sku: '452213238293',
				name: 'Philips ECC Phantom 452213238293',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213238293',
				slug: 'philips-ecc-phantom',
			},
			{
				sku: '452213067603',
				name: 'Philips Phantom Holder Perform 452213067603',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213067603',
				slug: 'philips-phantom-holder-perform',
			},
			{
				sku: '10207-10-PM2',
				name: 'Philips Presscall 10207-10-PM2',
				system: 'Philips 1.5T MRI',
				serialNumber: '10207-10-PM2',
				slug: 'philips-presscall',
			},
			{
				sku: '452213265281',
				name: 'Philips 14-IEC Power Socket Strip 452213265281',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213265281',
				slug: 'philips-14-iec-power-socket-strip',
			},
			{
				sku: '45221324473',
				name: 'Philips Laser 45221324473',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221324473',
				slug: 'philips-laser',
			},
			{
				sku: '453564123631',
				name: 'Philips DCU Power Converter Kit 453564123631',
				system: 'Philips 1.5T MRI',
				serialNumber: '453564123631',
				slug: 'philips-dcu-power-converter-kit',
			},
			{
				sku: '452213161505',
				name: 'Philips Patient Table 452213161505',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213161505',
				slug: 'philips-patient-table',
			},
			{
				sku: '8871004203',
				name: 'Philips ZEITLAU TG53 10V 8871004203',
				system: 'Philips 1.5T MRI',
				serialNumber: '8871004203',
				slug: 'philips-zeitlau-tg53-10v',
			},
			{
				sku: '45221320825',
				name: 'Philips MR Trolley 45221320825',
				system: 'Philips 1.5T MRI',
				serialNumber: '45221320825',
				slug: 'philips-mr-trolley',
			},
			{
				sku: '452213315341',
				name: 'Philips HP Z400 WORKSTATION 452213315341',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213315341',
				slug: 'philips-hp-z400-workstation',
			},
			{
				sku: '452213314441',
				name: 'Philips RECON Z400 12GB CDAS 452213314441',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213314441',
				slug: 'philips-recon-z400-12gb-cdas',
			},
			{
				sku: '452213256472',
				name: 'Philips FIBER RL-B2 - RDH-B1 452213256472',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213256472',
				slug: 'philips-fiber-rl-b2-rdh-b1',
			},
			{
				sku: '452213317862',
				name: 'Philips CABLE RE/FE-X2 - RDJ/FDJ-X1 452213317862',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213317862',
				slug: 'philips-cable-re-fe-x2-rdj-fdj-x1',
			},
			{
				sku: '452213255612',
				name: 'Philips FIBER DGB-B1 - RDF-B7 452213255612',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213255612',
				slug: 'philips-fiber-dgb-b1-rdf-b7',
			},
			{
				sku: '264901D20J',
				name: 'Sumitomo HC-8E1 Compressor 264901D20J',
				system: 'Philips 1.5T MRI',
				serialNumber: '264901D20J',
				slug: 'sumitomo-hc-8e1-compressor',
			},
			{
				sku: '989603013900',
				name: 'Philips Gradient Liquid Cooling Cabinet 989603013900',
				system: 'Philips 1.5T MRI',
				serialNumber: '989603013900',
				slug: 'philips-gradient-liquid-cooling-cabinet',
			},
			{
				sku: '459800017121',
				name: 'Philips DVI CABLE FLA/RLA-X3 - FL/RL-X 459800017121',
				system: 'Philips 1.5T MRI',
				serialNumber: '459800017121',
				slug: 'philips-dvi-cable-fla-rla-x3-fl-rl-x',
			},
			{
				sku: 'Cupper Rf Window',
				name: 'Imedco Mri Cupper Rf Window',
				system: 'Philips 1.5T MRI',
				serialNumber: 'Cupper Rf Window',
				slug: 'imedco-mri-cupper-rf-window',
			},
			{
				sku: '452213255442',
				name: 'Philips Cable Harness RDM-X1/X2/X3-RR 452213255442',
				system: 'Philips 1.5T MRI',
				serialNumber: '452213255442',
				slug: 'philips-cable-harness-rdm-x1-x2-x3-rr',
			},
			{
				sku: 'ST373455FC',
				name: 'Seagate Cheetah Fiber Channel Hard Drive ST373455FC',
				system: 'Philips 1.5T MRI',
				serialNumber: 'ST373455FC',
				slug: 'seagate-cheetah-fiber-channel-hard-drive',
			},
			{
				sku: 'PX74-09505',
				name: 'Toshiba CT MHR-BP Board PX74-09505',
				system: 'Philips 1.5T MRI',
				serialNumber: 'PX74-09505',
				slug: 'toshiba-ct-mhr-bp-board',
			},
			// BURADAN SONRA SEN LİSTENDEKİ KALANLARI AYNI FORMATTA EKLE
			// { sku: "...", name: "...", system: "...", serialNumber: "...", slug: "..." },
		];

		// 2) HAM DATA → Product şemasına uygun objeler
		const products = rawProducts.map((p) => {
			const baseName = p.name.replace(p.sku, '').trim() || p.name;

			return {
				sku: p.sku,
				mpn: p.sku,
				oem: 'Philips', // Toshiba / Invivo olanlarda tek tek override edebilirsin
				name: p.name,
				serialNumber: p.serialNumber,
				title: `BugaMed - ${p.name}`,
				subtitle: `System Model: ${p.system}`,
				system: p.system,
				condition: 'Used – Tested',
				warranty: '30 Days',
				imageUrl: `/assets/images/product/${p.sku}.jpeg`, // Eğer dosya ismi başka ise burada düzeltirsin
				slug: p.slug,
				canonicalUrl: `/part/${p.sku}/${p.slug}`,
				descriptionShort: `${p.name} spare part. Working - tested.`,
				descriptionText:
					'All boards are visually inspected, cleaned, and tested under load before shipping.',
				isTested: true,
				conditionTag: 'good',
			};
		});

		// 3) Toplu ekleme
		const result = await Product.insertMany(products, { ordered: false });
		console.log(`Toplam ${result.length} ürün eklendi.`);

		await mongoose.disconnect();
		console.log('MongoDB bağlantısı kapatıldı');
	} catch (err) {
		console.error('Seed hata:', err);
		await mongoose.disconnect();
	}
}

run();
