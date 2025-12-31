// PDF Receipt Generator
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateReceipt = (receiptData, callback) => {
    try {
        // Create receipts directory if it doesn't exist
        const receiptsDir = path.join(__dirname, '../../receipts');
        if (!fs.existsSync(receiptsDir)) {
            fs.mkdirSync(receiptsDir, { recursive: true });
        }

        // Generate filename
        const filename = `receipt_${receiptData.receiptNumber}.pdf`;
        const filepath = path.join(receiptsDir, filename);

        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filepath);

        doc.pipe(stream);

        // Header
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text('FLIGHT BOOKING RECEIPT', { align: 'center' })
           .moveDown();

        // Receipt Info
        doc.fontSize(10)
           .font('Helvetica')
           .text(`Receipt Number: ${receiptData.receiptNumber}`, { align: 'right' })
           .text(`Date: ${new Date(receiptData.generatedAt).toLocaleString()}`, { align: 'right' })
           .moveDown();

        // Divider
        doc.moveTo(50, doc.y)
           .lineTo(550, doc.y)
           .stroke()
           .moveDown();

        // Passenger Information
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Passenger Information')
           .moveDown(0.5);

        doc.fontSize(10)
           .font('Helvetica')
           .text(`Name: ${receiptData.passengerName}`)
           .text(`Email: ${receiptData.passengerEmail}`)
           .text(`Phone: ${receiptData.passengerPhone}`)
           .text(`Booking Reference: ${receiptData.bookingReference}`)
           .moveDown();

        // Flight Information
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Flight Information')
           .moveDown(0.5);

        doc.fontSize(10)
           .font('Helvetica')
           .text(`Flight Number: ${receiptData.flightNumber}`)
           .text(`Airline: ${receiptData.airline}`)
           .text(`Route: ${receiptData.origin} → ${receiptData.destination}`)
           .text(`Departure: ${new Date(receiptData.departureTime).toLocaleString()}`)
           .text(`Arrival: ${new Date(receiptData.arrivalTime).toLocaleString()}`)
           .text(`Seat Number: ${receiptData.seatNumber || 'To be assigned'}`)
           .moveDown();

        // Payment Information
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Payment Information')
           .moveDown(0.5);

        doc.fontSize(10)
           .font('Helvetica')
           .text(`Amount Paid: $${parseFloat(receiptData.amount).toFixed(2)}`)
           .text(`Payment Method: ${receiptData.paymentMethod}`)
           .text(`Transaction ID: ${receiptData.transactionId}`)
           .text(`Payment Date: ${new Date(receiptData.paymentDate).toLocaleString()}`)
           .moveDown();

        // Divider
        doc.moveTo(50, doc.y)
           .lineTo(550, doc.y)
           .stroke()
           .moveDown();

        // Footer
        doc.fontSize(10)
           .font('Helvetica-Oblique')
           .text('Thank you for booking with us!', { align: 'center' })
           .moveDown(0.5)
           .fontSize(8)
           .text('Please arrive at the airport at least 2 hours before departure.', { align: 'center' })
           .text('This is an electronic receipt and does not require a signature.', { align: 'center' });

        // Finalize PDF
        doc.end();

        stream.on('finish', () => {
            callback(null, filepath);
        });

        stream.on('error', (error) => {
            callback(error, null);
        });

    } catch (error) {
        callback(error, null);
    }
};

module.exports = { generateReceipt };

