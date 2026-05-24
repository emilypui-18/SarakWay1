import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Image, ActivityIndicator, Animated, Dimensions, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons, Feather } from "@expo/vector-icons";
import guideStyles from '../styles/guide';

const LOGO = require("../assets/logos/SarakWay-logo.png");
const API_URL = "http://172.20.10.4:3000/detect";
const SCREEN_H = Dimensions.get("window").height;

// Retaining this for functional logic colors inside JS maps
const C = {
  plant: "#2A6B3C", plantBg: "#E8F5ED",
  animal: "#B45309", animalBg: "#FEF3C7",
  unknown: "#374151", unknownBg: "#F3F4F6",
};

const FEATURES = [
  { icon: "leaf", label: "Plants", sub: "250k+ species", color: "#2A6B3C", bg: "#E8F5ED" },
  { icon: "paw", label: "Wildlife", sub: "Animals & birds", color: "#B45309", bg: "#FEF3C7" },
  { icon: "map", label: "Sarawak", sub: "Rainforest focus", color: "#0369A1", bg: "#E0F2FE" },
];

export default function GuideAR({ setCurrentScreen, toggleMenu }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null);

  const [results, setResults] = useState([]);
  const [selectedResult, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [noMatch, setNoMatch] = useState(false);

  // Animations
  const sheetY = useRef(new Animated.Value(SCREEN_H)).current;
  const cornerFade = useRef(new Animated.Value(0.5)).current;
  const cardAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  const hasResults = results.length > 0;
  const sheetItem = selectedResult; 

  useEffect(() => {
    if (!cameraVisible) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(cornerFade, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(cornerFade, { toValue: 0.5, duration: 1300, useNativeDriver: true }),
      ])
    );
    if (!hasResults) anim.start();
    else { anim.stop(); cornerFade.setValue(0.4); }
    return () => anim.stop();
  }, [hasResults, cameraVisible]);

  useEffect(() => {
    if (hasResults && !showSheet && cameraVisible) {
      cardAnims.forEach(a => a.setValue(0));
      Animated.stagger(90, cardAnims.slice(0, results.length).map(anim =>
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 72, friction: 9 })
      )).start();
    }
  }, [results, showSheet, cameraVisible]);

  useEffect(() => {
    if (!cameraVisible) return;
    const first = setTimeout(() => captureImage(), 1500);
    const id = setInterval(() => { if (!loading && !showSheet) captureImage(); }, 4000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, [loading, showSheet, cameraVisible]);

  const openSheet = (item) => {
    setSelected(item);
    setShowSheet(true);
    Animated.spring(sheetY, { toValue: 0, useNativeDriver: true, tension: 68, friction: 11 }).start();
  };

  const closeSheet = () => {
    Animated.timing(sheetY, { toValue: SCREEN_H, duration: 260, useNativeDriver: true }).start(() => {
      setShowSheet(false);
      setSelected(null);
      setResults([]);
    });
  };

  const captureImage = async () => {
    if (!cameraRef.current || loading || showSheet) return;
    setLoading(true); setScanError(null);
    try {
      const photo = await cameraRef.current.takePictureAsync({ 
        base64: true, 
        quality: 0.5, 
        skipProcessing: true 
      });
      
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      const res = await fetch(API_URL, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo.base64 }), signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      setResults(data.results || []);
      if ((data.results || []).length === 0) {
        setNoMatch(true); setTimeout(() => setNoMatch(false), 2500);
      }
    } catch (err) {
      setResults([]); setNoMatch(false);
      setScanError(err.name === "AbortError" ? "Scan timed out — check your Wi-Fi" : "Backend unreachable — make sure the server is running");
    } finally { setLoading(false); }
  };

  // --- HOME SCREEN VIEW ---
  if (!cameraVisible) {
    return (
      <View style={guideStyles.homeRoot}>
        <StatusBar barStyle="light-content" />
        
        <TouchableOpacity onPress={toggleMenu} style={{position: 'absolute', top: 50, left: 20, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 8}}>
          <Feather name="menu" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={guideStyles.hero}>
          {/* FIXED: Using your exact Admin Profile layout for the logo! */}
          <Image 
            source={LOGO} 
            defaultSource={LOGO}
            style={{ width: 90, height: 90, marginBottom: 15 }} 
            resizeMode="contain"
            fadeDuration={0} 
          />
          <Text style={guideStyles.heroTitle}>SarakWay</Text>
          <Text style={guideStyles.heroSub}>AI-powered species identification{"\n"}for Sarawak's rainforests</Text>
        </View>

        <ScrollView style={guideStyles.card} contentContainerStyle={guideStyles.cardContent} showsVerticalScrollIndicator={false}>
          <Text style={guideStyles.sectionTitle}>What can it identify?</Text>
          
          <View style={guideStyles.featureRow}>
            {FEATURES.map((f) => (
              <View key={f.label} style={guideStyles.featureCard}>
                <View style={[guideStyles.featureIcon, { backgroundColor: f.bg }]}>
                  <Ionicons name={f.icon} size={22} color={f.color} />
                </View>
                <Text style={guideStyles.featureLabel}>{f.label}</Text>
                <Text style={guideStyles.featureSub}>{f.sub}</Text>
              </View>
            ))}
          </View>

          <View style={guideStyles.howCard}>
            <View style={guideStyles.howHeader}>
              <Ionicons name="sparkles" size={15} color="#2A6B3C" style={{ marginRight: 6 }} />
              <Text style={guideStyles.howTitle}>How it works</Text>
            </View>
            {[ "Open the AR scanner", "Point at a plant or animal", "Get instant identification" ].map((text, i) => (
              <View key={i} style={guideStyles.stepRow}>
                <View style={guideStyles.stepBadge}><Text style={guideStyles.stepNum}>{i+1}</Text></View>
                <Text style={guideStyles.stepText}>{text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={guideStyles.cta} onPress={() => {
            if (!permission) requestPermission();
            else if (!permission.granted) requestPermission();
            else setCameraVisible(true);
          }} activeOpacity={0.85}>
            <Ionicons name="scan" size={20} color="#fff" />
            <Text style={guideStyles.ctaText}>Launch AR Scanner</Text>
            <View style={guideStyles.ctaArrow}><Ionicons name="arrow-forward" size={15} color="rgba(255,255,255,0.75)" /></View>
          </TouchableOpacity>
          <Text style={guideStyles.footer}>Powered by PlantNet & iNaturalist</Text>
        </ScrollView>
      </View>
    );
  }

  // --- CAMERA VIEW ---
  return (
    <View style={guideStyles.arRoot}>
      <StatusBar barStyle="light-content" />
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />

      <View style={guideStyles.topBar}>
        <TouchableOpacity style={guideStyles.backBtn} onPress={() => { setCameraVisible(false); setResults([]); }}>
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>
        {/* FIXED: Clean inline styling for the top bar logo! */}
        <Image 
          source={LOGO} 
          defaultSource={LOGO}
          style={{ width: 32, height: 32, marginLeft: 4 }} 
          resizeMode="contain"
          fadeDuration={0} 
        />
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={guideStyles.topTitle}>SarakWay</Text>
          <Text style={guideStyles.topSub}>Species Scanner</Text>
        </View>
        <View style={[guideStyles.livePill, hasResults && { backgroundColor: "rgba(42,107,60,0.75)" }]}>
          {loading ? <ActivityIndicator size={8} color="#fff" style={{ marginRight: 5 }} /> : hasResults ? <Ionicons name="checkmark-circle" size={11} color="#4ADE80" style={{ marginRight: 4 }} /> : <View style={guideStyles.liveDot} />}
          <Text style={guideStyles.liveText}>{loading ? "SCANNING" : hasResults ? `${results.length} FOUND` : "LIVE"}</Text>
        </View>
      </View>

      <View style={guideStyles.scanFrame} pointerEvents="none">
        <Animated.View style={[guideStyles.corner, guideStyles.cTL, { opacity: cornerFade }]} />
        <Animated.View style={[guideStyles.corner, guideStyles.cTR, { opacity: cornerFade }]} />
        <Animated.View style={[guideStyles.corner, guideStyles.cBL, { opacity: cornerFade }]} />
        <Animated.View style={[guideStyles.corner, guideStyles.cBR, { opacity: cornerFade }]} />
        
        {loading && !hasResults && <View style={guideStyles.frameBadge}><ActivityIndicator size="small" color="#fff" style={{ marginRight: 7 }} /><Text style={guideStyles.frameBadgeText}>Identifying...</Text></View>}
        {!loading && !hasResults && !noMatch && <View style={guideStyles.frameBadge}><View style={guideStyles.frameDot} /><Text style={guideStyles.frameBadgeText}>Scanning for species...</Text></View>}
        {!loading && noMatch && <View style={[guideStyles.frameBadge, { backgroundColor: "rgba(60,60,60,0.82)" }]}><Ionicons name="eye-off-outline" size={14} color="#ccc" style={{ marginRight: 7 }} /><Text style={guideStyles.frameBadgeText}>Nothing found — move closer</Text></View>}
      </View>

      {scanError && !hasResults && (
        <View style={guideStyles.errorBanner}>
          <Ionicons name="warning" size={15} color="#fff" style={{ marginRight: 7 }} />
          <Text style={guideStyles.errorText} numberOfLines={2}>{scanError}</Text>
        </View>
      )}

      {hasResults && !showSheet && (
        <View style={guideStyles.cardsArea}>
          {results.map((item, i) => {
            const color = item.type === "animal" ? C.animal : C.plant;
            const bg = item.type === "animal" ? C.animalBg : C.plantBg;
            const icon = item.type === "animal" ? "paw" : "leaf";
            const anim = cardAnims[i];

            return (
              <Animated.View key={i} style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
                <TouchableOpacity style={[guideStyles.resultCard, { borderLeftColor: color }]} onPress={() => openSheet(item)} activeOpacity={0.82}>
                  <View style={[guideStyles.cardIconBox, { backgroundColor: bg }]}><Ionicons name={icon} size={18} color={color} /></View>
                  <View style={{ flex: 1 }}>
                    <Text style={[guideStyles.cardTypeText, { color }]}>{item.type}</Text>
                    <Text style={guideStyles.cardNameText} numberOfLines={1}>{item.species_name}</Text>
                    {item.scientific_name && <Text style={guideStyles.cardSciText} numberOfLines={1}>{item.scientific_name}</Text>}
                  </View>
                  <View style={guideStyles.cardRight}>
                    <Text style={[guideStyles.cardConf, { color }]}>{Math.round((item.confidence || 0) * 100)}%</Text>
                    <Ionicons name="chevron-forward" size={14} color={color} style={{ marginTop: 1 }} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* --- Details Bottom Sheet --- */}
      <Animated.View style={[guideStyles.sheet, { transform: [{ translateY: sheetY }] }]}>
        {sheetItem && (
          <>
            <View style={guideStyles.sheetHandle} />
            <View style={[guideStyles.sheetAccent, { backgroundColor: sheetItem.type === "animal" ? C.animal : C.plant }]} />
            <View style={guideStyles.sheetBody}>
              <View style={guideStyles.speciesRow}>
                <View style={[guideStyles.speciesIconBox, { backgroundColor: sheetItem.type === "animal" ? C.animalBg : C.plantBg }]}>
                  <Ionicons name={sheetItem.type === "animal" ? "paw" : "leaf"} size={22} color={sheetItem.type === "animal" ? C.animal : C.plant} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[guideStyles.sheetTypeLabel, { color: sheetItem.type === "animal" ? C.animal : C.plant }]}>
                    {sheetItem.type === "animal" ? "Wildlife Detected" : "Plant Detected"}
                  </Text>
                  <Text style={guideStyles.sheetSpeciesName} numberOfLines={2}>{sheetItem.species_name}</Text>
                </View>
              </View>
              {sheetItem.scientific_name && <Text style={guideStyles.sheetSciName}>{sheetItem.scientific_name}</Text>}
              
              <Text style={guideStyles.sheetDesc}>{sheetItem.description}</Text>
              
              <TouchableOpacity style={[guideStyles.scanAgainBtn, { backgroundColor: sheetItem.type === "animal" ? C.animal : C.plant }]} onPress={closeSheet}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={guideStyles.scanAgainText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animated.View>
    </View>
  );
}