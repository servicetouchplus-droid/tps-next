import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00', // Orange Touch+
  },
  companyInfo: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
  },
  invoiceInfo: {
    marginBottom: 40,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 12,
    marginBottom: 10,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#e5e7eb',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
  },
  tableColWide: {
    width: '50%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#e5e7eb',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
  totalSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalBox: {
    width: '50%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  }
});

export const InvoicePDF = ({ order }) => {
  // Dans le modèle Order, options est un JSON. S'il s'agit d'une array, on boucle, sinon c'est le produit
  const items = Array.isArray(order.options) ? order.options : [{ product: order.product, quantity: order.quantity }];
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>FACTURE</Text>
            <Text style={{ fontSize: 10, marginTop: 5 }}>N° {order.id.split('-')[0]}</Text>
          </View>
          <View style={styles.companyInfo}>
            <Text style={{ fontWeight: 'bold', color: '#000' }}>Touch+ Services</Text>
            <Text>Zone Industrielle, Koumassi</Text>
            <Text>Abidjan, Côte d'Ivoire</Text>
            <Text>contact@touchplus.ci</Text>
          </View>
        </View>

        {/* Info Client & Facture */}
        <View style={styles.invoiceInfo}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.label}>Facturé à :</Text>
              <Text style={styles.value}>{order.user.name || order.user.email}</Text>
              <Text style={styles.value}>{order.user.email}</Text>
            </View>
            <View>
              <Text style={styles.label}>Date :</Text>
              <Text style={styles.value}>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</Text>
              <Text style={styles.label}>Statut Paiement :</Text>
              <Text style={styles.value}>{order.paymentStatus}</Text>
            </View>
          </View>
        </View>

        {/* Tableau des articles */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColWide}>
              <Text style={styles.tableCell}>Désignation</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Quantité</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Montant (FCFA)</Text>
            </View>
          </View>

          {items.map((item, i) => (
            <View style={styles.tableRow} key={i}>
              <View style={styles.tableColWide}>
                <Text style={styles.tableCell}>{item.product}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.quantity ? 5000 * item.quantity : 5000}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totaux */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total :</Text>
              <Text style={{ fontSize: 10 }}>{order.total} FCFA</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TVA (18%) :</Text>
              <Text style={{ fontSize: 10 }}>{Math.round(order.total * 0.18)} FCFA</Text>
            </View>
            <View style={[styles.totalRow, { marginTop: 10 }]}>
              <Text style={styles.totalLabel}>Total TTC :</Text>
              <Text style={styles.totalValue}>{order.total + Math.round(order.total * 0.18)} FCFA</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Merci pour votre confiance. La production de votre commande commence dès validation du BAT.</Text>
          <Text>Touch+ Services - RCCM : CI-ABJ-XXXXX - N° CC : XXXXXXX</Text>
        </View>
      </Page>
    </Document>
  );
};
